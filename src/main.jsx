import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

let deferredPrompt = null;

function createInstallButton() {
      if (document.getElementById('pwa-install-btn')) return;
      const btn = document.createElement('button');
      btn.id = 'pwa-install-btn';
      btn.textContent = 'Installer l\'app';
      btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;background:#c8553d;color:#fff;border:none;padding:12px 20px;border-radius:999px;font-size:15px;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.2);cursor:pointer;';
      btn.onclick = async () => {
              if (!deferredPrompt) return;
              deferredPrompt.prompt();
              const { outcome } = await deferredPrompt.userChoice;
              if (outcome === 'accepted') btn.remove();
              deferredPrompt = null;
      };
      document.body.appendChild(btn);
}

window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      createInstallButton();
});

window.addEventListener('appinstalled', () => {
      const btn = document.getElementById('pwa-install-btn');
      if (btn) btn.remove();
      deferredPrompt = null;
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
