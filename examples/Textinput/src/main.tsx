import React from 'react';
import ReactDOM from 'react-dom/client';
import { CSPHelmet, CSPMeta } from 'protecjs';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CSPHelmet>
      <CSPMeta
        policy="default-src 'self'; script-src 'self' https://apis.google.com"
        // Optionally, you can add additional meta tags to the document head
        additionalMetaTags={[
          { name: 'description', content: 'This is a sample app' },
          { property: 'og:title', content: 'Sample App' }
        ]}
      />
      <App />
    </CSPHelmet>
  </React.StrictMode>,
);
