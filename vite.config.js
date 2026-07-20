import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // GitHub Pages deploys at https://oohcecilia.github.io/philmanpower/
  // Override via VITE_BASE_PATH env var (e.g. for custom domains use '/')
  const base = env.VITE_BASE_PATH || '/'

  return {
    base,
    plugins: [
      react(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_SERVER || 'http://localhost:3001',
          changeOrigin: true,
        },
        '/uploads': {
          target: env.VITE_API_SERVER || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
});
