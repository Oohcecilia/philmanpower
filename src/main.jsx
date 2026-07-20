import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { queryClientInstance } from '@/lib/query-client';
import { AuthProvider } from '@/lib/AuthContext';
import jsonService from '@/lib/jsonService';
import App from '@/App';
import './index.css';

// Initialize i18n
import './lib/i18n';

async function bootstrap() {
  await jsonService.init();

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <QueryClientProvider client={queryClientInstance}>
          <AuthProvider>
            <HelmetProvider>
              <App />
            </HelmetProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

bootstrap();
