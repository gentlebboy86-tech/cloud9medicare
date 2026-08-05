import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import HospitalCompanionApp from './HospitalCompanionApp.tsx';
import ManagerAdminApp from './ManagerAdminApp.tsx';
import ManagerApp from './ManagerApp.tsx';
import MessageApp from './MessageApp.tsx';
import StartupApp from './StartupApp.tsx';
import './index.css';

const path = window.location.pathname;
const route = window.location.hash.replace(/^#/, '');
// GitHub Pages base path(/cloud9medicare/) 포함하여 admin-send 경로 감지
const isAdminSend = path.endsWith('/admin-send') || path.endsWith('/admin-send/') || route === '/admin-send';
const isManager = path.endsWith('/manager') || path.endsWith('/manager/') || route === '/manager';
const isManagerAdmin =
  path.endsWith('/manager-admin') ||
  path.endsWith('/manager-admin/') ||
  path.endsWith('/admin-manager') ||
  path.endsWith('/admin-manager/') ||
  route === '/manager-admin' ||
  route === '/admin-manager';
const isStartup =
  path.endsWith('/startup') || path.endsWith('/startup/') || route === '/startup';
const isHospitalCompanion =
  path.endsWith('/hospital-companion') ||
  path.endsWith('/hospital-companion/') ||
  path.endsWith('/hospital') ||
  path.endsWith('/hospital/') ||
  path.endsWith('/companion') ||
  path.endsWith('/companion/') ||
  route === '/hospital-companion' ||
  route === '/hospital' ||
  route === '/companion';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminSend ? (
      <MessageApp />
    ) : isManagerAdmin ? (
      <ManagerAdminApp />
    ) : isManager ? (
      <ManagerApp />
    ) : isStartup ? (
      <StartupApp />
    ) : isHospitalCompanion ? (
      <HospitalCompanionApp />
    ) : (
      <App />
    )}
  </StrictMode>,
);
