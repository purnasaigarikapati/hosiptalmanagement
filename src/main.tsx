import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { HealthProvider } from './context/HealthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HealthProvider>
      <App />
    </HealthProvider>
  </React.StrictMode>
);
