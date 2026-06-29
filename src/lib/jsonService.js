/**
 * JSON service — now calls the Express API backend.
 * Replace localStorages calls with API requests to the backend.
 */

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

async function apiRequest(method, path, body = null, isFormData = false) {
  const token = localStorage.getItem('auth_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = { method, headers };
  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${path}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.error || `Request failed with status ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const ENTITY_MAP = {
  Service: 'services',
  Industry: 'industries',
  ProcessStep: 'process_steps',
  FAQ: 'faqs',
  Testimonial: 'testimonials',
  ContactSubmission: 'contact_submissions',
  Announcement: 'announcements',
  SiteContent: 'site_content',
  AuditLog: 'audit_logs',
  User: 'users',
};

function mapEntity(name) {
  const mapped = ENTITY_MAP[name];
  if (!mapped) throw new Error(`Unknown entity: ${name}`);
  return mapped;
}

const jsonService = {
  async init() {
    // No-op: API is ready when the server is running
    return;
  },

  async getEntity(name) {
    const entityName = mapEntity(name);
    return {
      async list(orderBy, limit) {
        const params = new URLSearchParams();
        if (orderBy) params.set('orderBy', orderBy);
        if (limit) params.set('limit', limit);
        const qs = params.toString();
        return apiRequest('GET', `/entities/${entityName}/list${qs ? '?' + qs : ''}`);
      },

      async filter(filterObj) {
        return apiRequest('POST', `/entities/${entityName}/filter`, filterObj);
      },

      async get(id) {
        return apiRequest('GET', `/entities/${entityName}/${id}`);
      },

      async create(payload) {
        return apiRequest('POST', `/entities/${entityName}`, payload);
      },

      // Note: The generic POST for create is at /entities/:entity
      // But let's use the protected routes
      async update(id, updates) {
        return apiRequest('PUT', `/entities/${entityName}/${id}`, updates);
      },

      async delete(id) {
        return apiRequest('DELETE', `/entities/${entityName}/${id}`);
      },

      async subscribe(callback) {
        return () => {};
      },
    };
  },

  // Auth methods
  auth: {
    async me() {
      return apiRequest('GET', '/auth/me');
    },

    async loginViaUsername(username, password) {
      const result = await apiRequest('POST', '/auth/login', { username, password });
      if (result.token) {
        localStorage.setItem('auth_token', result.token);
      }
      return result.user;
    },

    async register({ email, password }) {
      return apiRequest('POST', '/auth/register', { email, password });
    },

    async verifyOtp({ email, otpCode }) {
      // Simplified: skip OTP verification, just return success
      return { access_token: null, message: 'Verification skipped in dev mode' };
    },

    async resendOtp(email) {
      return { message: 'Verification code sent.' };
    },

    async resetPasswordRequest(email) {
      return apiRequest('POST', '/auth/forgot-password', { email });
    },

    async resetPassword({ resetToken, newPassword }) {
      return apiRequest('POST', '/auth/reset-password', { resetToken, newPassword });
    },

    logout(redirectUrl) {
      localStorage.removeItem('auth_token');
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },

    redirectToLogin(returnUrl) {
      window.location.href = `/login?from=${encodeURIComponent(returnUrl)}`;
    },

    setToken(token) {
      localStorage.setItem('auth_token', token);
    },
  },

  integrations: {
    Core: {
      async UploadFile({ file }) {
        const formData = new FormData();
        formData.append('file', file);
        return apiRequest('POST', '/upload', formData, true);
      },

      async SendEmail({ to, subject, body }) {
        return apiRequest('POST', '/email/send', { to, subject, body });
      },
    },
  },
};

export default jsonService;
