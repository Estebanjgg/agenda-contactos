import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './APIIntegration.css';

const APIIntegration = ({ contacts, onContactsSync }) => {
  const { t } = useLanguage();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [apiProvider, setApiProvider] = useState('google'); // google, outlook, etc.
  const [syncDirection, setSyncDirection] = useState('both'); // import, export, both
  const [autoSync, setAutoSync] = useState(false);
  const [syncInterval, setSyncInterval] = useState(60); // minutos

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('apiIntegrationConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setIsConnected(config.isConnected || false);
      setApiProvider(config.apiProvider || 'google');
      setSyncDirection(config.syncDirection || 'both');
      setAutoSync(config.autoSync || false);
      setSyncInterval(config.syncInterval || 60);
      setLastSync(config.lastSync ? new Date(config.lastSync) : null);
    }
  }, []);

  // Guardar configuración
  const saveConfig = (config) => {
    const currentConfig = {
      isConnected,
      apiProvider,
      syncDirection,
      autoSync,
      syncInterval,
      lastSync: lastSync?.toISOString(),
      ...config
    };
    localStorage.setItem('apiIntegrationConfig', JSON.stringify(currentConfig));
  };

  // Simular conexión con API externa
  const handleConnect = async () => {
    setIsLoading(true);
    setSyncStatus(t('connecting'));
    
    try {
      // Simular proceso de autenticación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En una implementación real, aquí se haría la autenticación OAuth
      const success = Math.random() > 0.2; // 80% de éxito
      
      if (success) {
        setIsConnected(true);
        setSyncStatus(t('connectionSuccessful'));
        saveConfig({ isConnected: true });
      } else {
        throw new Error('Connection failed');
      }
    } catch (error) {
      setSyncStatus(t('connectionFailed'));
      console.error('API connection error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus(''), 3000);
    }
  };

  // Desconectar de la API
  const handleDisconnect = () => {
    setIsConnected(false);
    setSyncStatus(t('disconnected'));
    saveConfig({ isConnected: false });
    setTimeout(() => setSyncStatus(''), 3000);
  };

  // Sincronizar contactos
  const handleSync = async () => {
    if (!isConnected) {
      setSyncStatus(t('notConnected'));
      return;
    }

    setIsLoading(true);
    setSyncStatus(t('syncing'));
    
    try {
      // Simular sincronización
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let syncedContacts = [...contacts];
      let newContactsCount = 0;
      let updatedContactsCount = 0;
      
      if (syncDirection === 'import' || syncDirection === 'both') {
        // Simular importación de contactos externos
        const externalContacts = generateMockExternalContacts();
        newContactsCount = externalContacts.length;
        syncedContacts = [...syncedContacts, ...externalContacts];
      }
      
      if (syncDirection === 'export' || syncDirection === 'both') {
        // Simular exportación (en una implementación real se enviarían a la API)
        updatedContactsCount = contacts.length;
      }
      
      // Actualizar contactos locales
      onContactsSync(syncedContacts);
      
      const now = new Date();
      setLastSync(now);
      setSyncStatus(t('syncSuccessful', { 
        imported: newContactsCount, 
        exported: updatedContactsCount 
      }));
      saveConfig({ lastSync: now.toISOString() });
      
    } catch (error) {
      setSyncStatus(t('syncFailed'));
      console.error('Sync error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus(''), 5000);
    }
  };

  // Generar contactos de prueba para simular API externa
  const generateMockExternalContacts = () => {
    const mockContacts = [
      {
        id: Date.now() + Math.random(),
        nome: 'Ana García',
        telefone: '+34 612 345 678',
        email: 'ana.garcia@email.com',
        categoria: 'Trabajo',
        notas: 'Contacto importado desde ' + apiProvider,
        avatar: null
      },
      {
        id: Date.now() + Math.random() + 1,
        nome: 'Carlos Silva',
        telefone: '+55 11 98765 4321',
        email: 'carlos.silva@empresa.com',
        categoria: 'Profesional',
        notas: 'Contacto importado desde ' + apiProvider,
        avatar: null
      }
    ];
    
    // Retornar solo algunos contactos aleatoriamente
    return mockContacts.slice(0, Math.floor(Math.random() * mockContacts.length) + 1);
  };

  // Auto-sincronización
  useEffect(() => {
    if (autoSync && isConnected && syncInterval > 0) {
      const interval = setInterval(() => {
        handleSync();
      }, syncInterval * 60 * 1000); // Convertir minutos a milisegundos
      
      return () => clearInterval(interval);
    }
  }, [autoSync, isConnected, syncInterval]);

  const handleConfigChange = (key, value) => {
    const updates = { [key]: value };
    
    switch (key) {
      case 'apiProvider':
        setApiProvider(value);
        break;
      case 'syncDirection':
        setSyncDirection(value);
        break;
      case 'autoSync':
        setAutoSync(value);
        break;
      case 'syncInterval':
        setSyncInterval(value);
        break;
    }
    
    saveConfig(updates);
  };

  const formatLastSync = () => {
    if (!lastSync) return t('never');
    
    const now = new Date();
    const diffMs = now - lastSync;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minutesAgo', { minutes: diffMins });
    if (diffHours < 24) return t('hoursAgo', { hours: diffHours });
    return t('daysAgo', { days: diffDays });
  };

  return (
    <div className="api-integration">
      <div className="api-integration-header">
        <h3>
          <span className="icon">🔗</span>
          {t('apiIntegration')}
        </h3>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢' : '🔴'}
          </span>
          <span className="status-text">
            {isConnected ? t('connected') : t('disconnected')}
          </span>
        </div>
      </div>

      <div className="api-integration-content">
        {/* Configuración del proveedor */}
        <div className="config-section">
          <h4>{t('provider')}</h4>
          <div className="provider-selection">
            <label className="provider-option">
              <input
                type="radio"
                name="apiProvider"
                value="google"
                checked={apiProvider === 'google'}
                onChange={(e) => handleConfigChange('apiProvider', e.target.value)}
                disabled={isConnected}
              />
              <span className="provider-info">
                <span className="provider-icon">📧</span>
                <span className="provider-name">Google Contacts</span>
              </span>
            </label>
            
            <label className="provider-option">
              <input
                type="radio"
                name="apiProvider"
                value="outlook"
                checked={apiProvider === 'outlook'}
                onChange={(e) => handleConfigChange('apiProvider', e.target.value)}
                disabled={isConnected}
              />
              <span className="provider-info">
                <span className="provider-icon">📮</span>
                <span className="provider-name">Outlook Contacts</span>
              </span>
            </label>
            
            <label className="provider-option">
              <input
                type="radio"
                name="apiProvider"
                value="icloud"
                checked={apiProvider === 'icloud'}
                onChange={(e) => handleConfigChange('apiProvider', e.target.value)}
                disabled={isConnected}
              />
              <span className="provider-info">
                <span className="provider-icon">☁️</span>
                <span className="provider-name">iCloud Contacts</span>
              </span>
            </label>
          </div>
        </div>

        {/* Configuración de sincronización */}
        <div className="config-section">
          <h4>{t('syncSettings')}</h4>
          
          <div className="sync-direction">
            <label>{t('syncDirection')}</label>
            <select
              value={syncDirection}
              onChange={(e) => handleConfigChange('syncDirection', e.target.value)}
            >
              <option value="import">{t('importOnly')}</option>
              <option value="export">{t('exportOnly')}</option>
              <option value="both">{t('bidirectional')}</option>
            </select>
          </div>
          
          <div className="auto-sync">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={autoSync}
                onChange={(e) => handleConfigChange('autoSync', e.target.checked)}
              />
              {t('enableAutoSync')}
            </label>
            
            {autoSync && (
              <div className="sync-interval">
                <label>{t('syncInterval')}</label>
                <select
                  value={syncInterval}
                  onChange={(e) => handleConfigChange('syncInterval', parseInt(e.target.value))}
                >
                  <option value={15}>15 {t('minutes')}</option>
                  <option value={30}>30 {t('minutes')}</option>
                  <option value={60}>1 {t('hour')}</option>
                  <option value={180}>3 {t('hours')}</option>
                  <option value={360}>6 {t('hours')}</option>
                  <option value={720}>12 {t('hours')}</option>
                  <option value={1440}>24 {t('hours')}</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="actions-section">
          {!isConnected ? (
            <button
              className="connect-btn"
              onClick={handleConnect}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  {t('connecting')}
                </>
              ) : (
                <>
                  <span className="icon">🔗</span>
                  {t('connect')}
                </>
              )}
            </button>
          ) : (
            <div className="connected-actions">
              <button
                className="sync-btn"
                onClick={handleSync}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    {t('syncing')}
                  </>
                ) : (
                  <>
                    <span className="icon">🔄</span>
                    {t('syncNow')}
                  </>
                )}
              </button>
              
              <button
                className="disconnect-btn"
                onClick={handleDisconnect}
                disabled={isLoading}
              >
                <span className="icon">🔌</span>
                {t('disconnect')}
              </button>
            </div>
          )}
        </div>

        {/* Estado y información */}
        <div className="status-section">
          {syncStatus && (
            <div className={`sync-status ${syncStatus.includes(t('successful')) || syncStatus.includes(t('connectionSuccessful')) ? 'success' : 'error'}`}>
              {syncStatus}
            </div>
          )}
          
          <div className="sync-info">
            <div className="info-item">
              <span className="info-label">{t('lastSync')}:</span>
              <span className="info-value">{formatLastSync()}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">{t('localContacts')}:</span>
              <span className="info-value">{contacts.length}</span>
            </div>
            
            {autoSync && isConnected && (
              <div className="info-item">
                <span className="info-label">{t('nextSync')}:</span>
                <span className="info-value">
                  {t('inMinutes', { minutes: syncInterval })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Información de ayuda */}
        <div className="help-section">
          <details>
            <summary>{t('howItWorks')}</summary>
            <div className="help-content">
              <p>{t('apiIntegrationHelp1')}</p>
              <p>{t('apiIntegrationHelp2')}</p>
              <p>{t('apiIntegrationHelp3')}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default APIIntegration;