import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import MessageApp from './MessageApp.tsx';
import './index.css';

const path = window.location.pathname;
const route = window.location.hash.replace(/^#/, '');
// GitHub Pages base path(/cloud9medicare/) 포함하여 admin-send 경로 감지
const isAdminSend = path.endsWith('/admin-send') || path.endsWith('/admin-send/') || route === '/admin-send';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminSend ? <MessageApp /> : <App />}
  </StrictMode>,
);
