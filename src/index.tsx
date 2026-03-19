import React from 'react';
import ReactDOM from 'react-dom/client';
import 'styles/App.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for offline support and faster loads
serviceWorkerRegistration.register(); 