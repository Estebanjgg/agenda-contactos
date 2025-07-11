import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './PWAInstaller.css';

const PWAInstaller = () => {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registrado: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registro falló: ', registrationError);
          });
      });
    }

    // Detectar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Escuchar evento de instalación
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Escuchar cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    // Detectar cambios en la conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
    } else {
      console.log('Usuario rechazó la instalación');
    }
    
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guardar en localStorage que el usuario rechazó la instalación
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // No mostrar si ya está instalado o si el usuario ya rechazó
  if (isInstalled || localStorage.getItem('pwa-install-dismissed')) {
    return (
      <div className="pwa-status">
        {!isOnline && (
          <div className="offline-indicator">
            <span className="offline-icon">📡</span>
            <span>{t('offlineMode')}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Indicador de estado de conexión */}
      {!isOnline && (
        <div className="offline-indicator">
          <span className="offline-icon">📡</span>
          <span>{t('offlineMode')}</span>
        </div>
      )}
      
      {/* Prompt de instalación */}
      {showInstallPrompt && (
        <div className="pwa-install-prompt">
          <div className="pwa-install-content">
            <div className="pwa-install-icon">📱</div>
            <div className="pwa-install-text">
              <h4>{t('installApp')}</h4>
              <p>{t('installAppDescription')}</p>
            </div>
            <div className="pwa-install-actions">
              <button 
                className="pwa-btn pwa-btn-install"
                onClick={handleInstallClick}
              >
                {t('install')}
              </button>
              <button 
                className="pwa-btn pwa-btn-dismiss"
                onClick={handleDismiss}
              >
                {t('dismiss')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstaller;