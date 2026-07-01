# Deployment Guide — Image Upload & Serving

## Table of Contents

1. [Root Cause Analysis](#1-root-cause-analysis)
2. [How the Image Pipeline Works](#2-how-the-image-pipeline-works)
3. [The Fix Applied](#3-the-fix-applied)
4. [Required Environment Variables](#4-required-environment-variables)
5. [File Storage Setup](#5-file-storage-setup)
6. [Static File Configuration](#6-static-file-configuration)
7. [Web Server Configuration (Nginx)](#7-web-server-configuration-nginx)
8. [Upload Directory Permissions](#8-upload-directory-permissions)
9. [Production Build Considerations](#9-production-build-considerations)
10. [Deployment Checklist](#10-deployment-checklist)
11. [Post-Deployment Verification](#11-post-deployment-verification)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Root Cause Analysis

### Why the announcement image does not display in production

The problem has **three layers**:

| # | Issue | Detail |
|---|-------|--------|
| 1 | **Uploads directory is gitignored** | `server/uploads` is in `.gitignore`. When deploying via git, no uploaded images or seed images are included. |
| 2 | **Relative image URLs break across origins** | Image paths are stored as `/uploads/uuid.jpg`. In development, Vite's dev server proxies `/uploads` to the Express backend. In production, there is no such proxy — the browser requests `/uploads/uuid.jpg` from the **frontend origin**, which doesn't serve it. |
| 3 | **`portrait.jpg` is never seeded** | `server/seed.js` only downloads `landscape.jpg`, but `announcements.json` references both `landscape.jpg` and `portrait.jpg`. |

### Why it works locally

- Vite dev server proxies `/uploads` → `http://localhost:3001`
- Express server at port 3001 serves files from `server/uploads/` via `express.static`
- The seed script creates `landscape.jpg` in `server/uploads/`

## 2. How the Image Pipeline Works

```
Admin uploads image
       │
       ▼
POST /api/upload ──── multer saves to ──── server/uploads/uuid.jpg
       │
       ▼
Returns { file_url: "/uploads/uuid.jpg" }
       │
       ▼
Frontend stores path in feature_image field
Announcement saved → server/data/announcements.json
       │
       ▼
Display: <img src="/uploads/uuid.jpg" />
       │
       ├── Dev: Vite proxy → Express → ✅
       └── Prod: Browser requests from frontend origin
                  ├── Same origin (reverse proxy) → ✅
                  └── Different origin → ❌ (404)
```

## 3. The Fix Applied

### `src/lib/imageUrl.js` (new file)

A utility function that resolves relative image paths (`/uploads/foo.jpg`) against the API server's origin when `VITE_API_BASE` is an absolute URL pointing to a different host.

```js
getImageUrl("/uploads/abc.jpg")
// VITE_API_BASE="/api"           → "/uploads/abc.jpg"        (same origin)
// VITE_API_BASE="https://api.example.com/api" → "https://api.example.com/uploads/abc.jpg"
// VITE_API_BASE not set          → "/uploads/abc.jpg"        (same origin)
```

**Files updated:**
- `src/components/landing/AnnouncementModal.jsx` — uses `getImageUrl()` for the modal image
- `src/pages/admin/AdminAnnouncements.jsx` — uses `getImageUrl()` for the admin preview and list thumbnails

### Same issue affects other components

The following components also store and display `/uploads/*` paths. They will exhibit the same problem in a cross-origin production setup:

- `src/pages/admin/AdminTheme.jsx` — logo & favicon uploads
- `src/pages/admin/AdminContent.jsx` — site content image uploads
- `src/pages/admin/AdminListPage.jsx` — generic list page image uploads

Apply the same `getImageUrl()` wrapper to their `<img>` tags if needed.

## 4. Required Environment Variables

### Frontend (`VITE_*` — set at build time)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE` | Production | `/api` | API base URL. Set to absolute URL when API is on a different origin (e.g. `https://api.example.com/api`). When set to an absolute URL, `getImageUrl()` uses its origin to resolve image paths. |
| `VITE_API_SERVER` | No | `http://localhost:3001` | Only used by Vite dev server proxy. Not used in production builds. |

### Backend (`process.env.*` — set at runtime)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_PORT` | No | `3001` | Port the Express server listens on |
| `CORS_ORIGIN` | Production | `http://localhost:5173` | Comma-separated allowed CORS origins. Must include the production frontend URL. |
| `JWT_SECRET` | Production | (none) | Secret for JWT token signing. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SMTP_HOST` | For email | (none) | SMTP server host |
| `SMTP_PORT` | For email | (none) | SMTP server port |
| `SMTP_USER` | For email | (none) | SMTP username |
| `SMTP_PASS` | For email | (none) | SMTP password |
| `EMAIL_FROM` | For email | (none) | From address for outgoing emails |

### Example `.env` file for production

```bash
# Backend (.env in server/)
API_PORT=3001
CORS_ORIGIN=https://www.philmanpower.com
JWT_SECRET=<generated-secret>

# Frontend (set during Vite build)
# VITE_API_BASE=https://api.philmanpower.com/api
```

## 5. File Storage Setup

### Directory structure

The Express server serves uploaded files from `server/uploads/` at the `/uploads` URL path:

```
server/
├── index.js          # Express app
├── routes/
│   └── upload.js     # Multer upload handler
├── uploads/          # <-- Uploaded files live here
│   ├── landscape.jpg
│   ├── portrait.jpg
│   └── <uuid>.jpg    # User-uploaded images
└── data/             # JSON data store
```

### On a fresh deployment

The upload directory is **NOT** included in git (it's in `.gitignore`). You must:

1. **Create the directory** — the server does this automatically on first upload, but it won't have seed images
2. **Run the seed script** to populate sample images:
   ```bash
   cd server
   npm run seed
   ```
3. **Upload images through the admin UI** — all uploads go to this directory

### On subsequent deployments

- **Persistent storage**: If using ephemeral infrastructure (e.g., Heroku, Kubernetes without persistent volumes), the `uploads/` directory will be lost on each restart. **You must use external storage** (S3, Cloud Storage, etc.) for any real deployment.
- **Migration path**: The current file-based system is acceptable for demo/staging. For production, swap to S3-compatible storage by updating `server/routes/upload.js` to use `multer-s3` or similar.

## 6. Static File Configuration

### Express server (`server/index.js`)

The server already serves uploaded files:

```js
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

For production, you will also need to serve the built frontend:

```js
// Serve Vite production build (optional — can use Nginx instead)
app.use(express.static(path.join(__dirname, '../dist')));

// SPA fallback: serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});
```

### Vite proxy (development only)

```js
// vite.config.js — only active during `vite dev`
server: {
  proxy: {
    '/api': { target: 'http://localhost:3001', changeOrigin: true },
    '/uploads': { target: 'http://localhost:3001', changeOrigin: true },
  },
}
```

## 7. Web Server Configuration (Nginx)

### Nginx reverse proxy (recommended for production)

```nginx
# /etc/nginx/sites-available/philmanpower
server {
    listen 80;
    server_name philmanpower.com www.philmanpower.com;

    # Redirect HTTP → HTTPS (if using SSL)
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name philmanpower.com www.philmanpower.com;

    ssl_certificate /etc/ssl/certs/philmanpower.crt;
    ssl_certificate_key /etc/ssl/private/philmanpower.key;

    # Root directory for static frontend build
    root /var/www/philmanpower/dist;
    index index.html;

    # API requests → Express backend
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploaded images → Express backend
    location /uploads/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Cache images aggressively
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend static files
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript image/svg+xml;
    gzip_min_length 1000;
}
```

### CORS Configuration

Make sure `CORS_ORIGIN` in the backend `.env` includes the production frontend URL:

```bash
CORS_ORIGIN=https://www.philmanpower.com
```

## 8. Upload Directory Permissions

### Linux / production server

```bash
# Create uploads directory
mkdir -p /path/to/project/server/uploads

# Ensure the Node.js process user (e.g., 'node' or 'www-data') owns it
chown -R node:node /path/to/project/server/uploads

# Set permissions: rwx for owner, r-x for group, --- for others
chmod 750 /path/to/project/server/uploads
```

The multer middleware automatically creates the directory if it doesn't exist, but proper permissions must be set.

## 9. Production Build Considerations

### 1. Build the frontend

```bash
# Set VITE_API_BASE for production (if API is cross-origin)
VITE_API_BASE=https://api.philmanpower.com/api npm run build

# Or for same-origin (reverse proxy)
npm run build
```

Output goes to `dist/`.

### 2. Seed the database

```bash
cd server
npm run seed
```

This creates the JSON data files and downloads sample images (`landscape.jpg` only).

### 3. Upload missing sample images

The seed script only downloads `landscape.jpg`. The `portrait.jpg` referenced in seed data must be uploaded manually:

- Log into the admin panel
- Go to Announcements
- Create/edit an announcement and upload a `portrait.jpg` image through the UI
- Or manually download it:
  ```bash
  curl -sL -o server/uploads/portrait.jpg "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80"
  ```

### 4. Start the server

```bash
cd server
node index.js
```

For production, use a process manager:

```bash
# Using PM2
npm install -g pm2
pm2 start server/index.js --name philmanpower-api

# Using systemd (preferred)
# See example below
```

### 5. systemd service example

```ini
# /etc/systemd/system/philmanpower-api.service
[Unit]
Description=PhilManPower API Server
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/var/www/philmanpower/server
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=API_PORT=3001
Environment=CORS_ORIGIN=https://www.philmanpower.com
Environment=JWT_SECRET=<your-secret>

[Install]
WantedBy=multi-user.target
```

## 10. Deployment Checklist

### Pre-deployment

- [ ] Set `VITE_API_BASE` to the production API URL (absolute if cross-origin, `/api` if reverse proxy)
- [ ] Run `npm run build` and verify no errors
- [ ] Verify the `dist/` directory was created
- [ ] Run `npm run lint` to check for code issues

### Server Setup

- [ ] Clone/deploy code to production server
- [ ] Run `cd server && npm install --production`
- [ ] Create `.env` file in `server/` with all required environment variables (see [§4](#4-required-environment-variables))
- [ ] Run `cd server && npm run seed` to initialize data files and sample images
- [ ] Upload `portrait.jpg` manually (seed only creates `landscape.jpg`)
- [ ] Verify `server/uploads/` directory exists and has correct permissions
- [ ] Install PM2 or configure systemd service (see [§9.5](#5-systemd-service-example))

### Nginx / Reverse Proxy

- [ ] Install Nginx if not already installed
- [ ] Copy/review Nginx config (see [§7](#7-web-server-configuration-nginx))
- [ ] Ensure `/uploads/` location block proxies to Express backend
- [ ] Ensure `/api/` location block proxies to Express backend
- [ ] Ensure frontend static files are served correctly
- [ ] Test Nginx config: `nginx -t`
- [ ] Reload Nginx: `systemctl reload nginx` or `nginx -s reload`

### Post-deployment Verification

- [ ] Visit `https://yoursite.com/api/health` — should respond with `{ "status": "ok" }`
- [ ] Navigate to a page with an announcement that has a `featured_image`
- [ ] Open browser DevTools → Network tab
- [ ] Find the image request (filter by `/uploads/`)
- [ ] Verify it returns **200** (not 404, 403, or 500)
- [ ] Check that the image is visible on the page
- [ ] Verify clicking the announcement opens the modal with the image displayed

## 11. Post-Deployment Verification

### Step-by-step verification

```bash
# 1. Health check
curl https://api.philmanpower.com/api/health
# Expected: {"status":"ok","timestamp":"..."}

# 2. Announcements API
curl https://api.philmanpower.com/api/entities/announcements/list
# Expected: JSON array of announcements with featured_image fields

# 3. Image direct access
curl -I https://api.philmanpower.com/uploads/landscape.jpg
# Expected: 200 OK, Content-Type: image/jpeg

# 4. Frontend access (via Nginx)
curl -I https://www.philmanpower.com/uploads/landscape.jpg
# Expected: 200 OK (proxied to backend)
# OR: 404 if Nginx is not proxying /uploads
```

### Browser checks

| Test | How | Expected |
|------|-----|----------|
| Image loads | Open page with announcement → check image visible | Image displays |
| Network status | DevTools → Network → filter `/uploads/` | 200 OK |
| Console errors | DevTools → Console | No 404, 403, or CORS errors |
| Mixed content | Check URL protocol | HTTPS page → HTTPS images |
| CORS | If cross-origin, check headers | `Access-Control-Allow-Origin` present |

## 12. Troubleshooting

### 404 — Image not found

| Possible Cause | Check / Fix |
|----------------|-------------|
| File doesn't exist | `ls -la server/uploads/` — run seed or re-upload |
| Wrong path | Compare stored path in `announcements.json` with actual filename |
| Nginx not proxying | Check `/uploads/` location block in Nginx config |
| `.gitignore` excluded files | `server/uploads` is in `.gitignore` — deploy manually or use CI artifact |

### 403 — Forbidden

| Possible Cause | Check / Fix |
|----------------|-------------|
| File permissions | `ls -la server/uploads/` — should be readable by Node process |
| Nginx deny rule | Check Nginx config for deny directives |
| SELinux | Check SELinux context: `restorecon -Rv server/uploads/` |

### 500 — Internal Server Error

| Possible Cause | Check / Fix |
|----------------|-------------|
| Server not running | `pm2 status` or `systemctl status philmanpower-api` |
| Port conflict | `netstat -tlnp | grep 3001` |
| Missing directory | Server auto-creates on first upload, but verify with `ls -la server/uploads` |

### Image loads but is broken / distorted

| Possible Cause | Check / Fix |
|----------------|-------------|
| Corrupted file | Re-upload the image through admin UI |
| Wrong content type | Check `Content-Type` response header — should match file extension |
| File size too large | Multer limit is 10MB, frontend compresses to 1200px width |

### CORS error in browser console

```
Access to image at 'https://api.example.com/uploads/abc.jpg'
from origin 'https://www.example.com' has been blocked by CORS policy
```

**Fix:** Add the frontend origin to the backend's CORS configuration:

```bash
# server/.env
CORS_ORIGIN=https://www.philmanpower.com
```

Or configure Nginx to add CORS headers for `/uploads/`:

```nginx
location /uploads/ {
    proxy_pass http://127.0.0.1:3001;
    
    add_header Access-Control-Allow-Origin "https://www.philmanpower.com";
    add_header Access-Control-Allow-Methods "GET, OPTIONS";
    add_header Access-Control-Allow-Headers "*";
    
    if ($request_method = OPTIONS) {
        return 204;
    }
}
```

### Mixed content warning (HTTP image on HTTPS page)

**Fix:** Ensure all URLs use HTTPS:

- `VITE_API_BASE` should use `https://` in production
- Nginx should terminate SSL and proxy to the Express backend
- The `getImageUrl()` utility preserves protocol — if `VITE_API_BASE` is `https://`, image URLs will be `https://`

---

## Appendix: Key Files Reference

| File | Purpose |
|------|---------|
| `server/index.js` | Express app — mounts `/uploads` static serving and API routes |
| `server/routes/upload.js` | Multer upload handler — saves to `server/uploads/`, returns relative URL |
| `src/lib/imageUrl.js` | **NEW** — Utility to resolve image URLs cross-origin |
| `src/lib/jsonService.js` | API client — `API_BASE` from `VITE_API_BASE` env var |
| `vite.config.js` | Dev proxy for `/api` and `/uploads` |
| `server/seed.js` | Seeds data files and sample images |
| `server/uploads/` | Uploaded files storage directory (gitignored) |
| `server/data/announcements.json` | Announcement data with `featured_image` paths |

## Appendix: Common Production Deployment Architectures

### Option A: Same origin (recommended)

```
User ──► Nginx (:443) ──► /api/* ──► Express (:3001)
                   ├──► /uploads/* ──► Express (:3001)
                   └──► /* ──► dist/index.html (SPA fallback)
```

- `VITE_API_BASE=/api` (default)
- No CORS issues
- Images served from same origin
- **Used by this deployment guide**

### Option B: Cross-origin (separate subdomains)

```
User ──► https://app.example.com ──► dist/index.html
   └──► https://api.example.com ──► Express (:3001)
```

- `VITE_API_BASE=https://api.example.com/api`
- CORS must be configured on the backend
- `getImageUrl()` resolves `/uploads/*` to `https://api.example.com/uploads/*`
- May need CORS headers on image responses

---

*Last updated: July 2026*
