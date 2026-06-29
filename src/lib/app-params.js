/**
 * Application parameters - simplified version without Base44 dependencies.
 */
export const appParams = {
  appId: null,
  token: localStorage.getItem('auth_token'),
  fromUrl: window.location.href,
  functionsVersion: null,
  appBaseUrl: null,
};
