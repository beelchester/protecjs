import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider, CSPMeta } from 'protecjs';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <CSPMeta 
        policy="default-src 'self'; script-src 'self' https://apis.google.com"
        additionalMetaTags={[
          { name: 'description', content: 'This is a sample app' },
          { property: 'og:title', content: 'Sample App' }
        ]}
      />
      <App />
    </HelmetProvider>
  </React.StrictMode>,
);