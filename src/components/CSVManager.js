import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { exportToCSV, downloadCSV, parseCSV, validateCSVFile, readCSVFile } from '../utils/csvUtils';
import './CSVManager.css';

const CSVManager = ({ contacts, onImportContacts }) => {
  const { t } = useLanguage();
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  // Exportar contactos a CSV
  const handleExport = () => {
    try {
      if (!contacts || contacts.length === 0) {
        setImportStatus({
          type: 'error',
          message: t('noContactsToExport')
        });
        return;
      }

      const csvContent = exportToCSV(contacts);
      const filename = `contactos_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      
      setImportStatus({
        type: 'success',
        message: t('exportSuccess')
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: t('exportError')
      });
    }
  };

  // Manejar selección de archivo
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    setIsImporting(true);
    setImportStatus(null);
    
    try {
      // Validar archivo
      await validateCSVFile(file);
      
      // Leer contenido
      const csvContent = await readCSVFile(file);
      
      // Parsear CSV
      const importedContacts = parseCSV(csvContent);
      
      if (importedContacts.length === 0) {
        throw new Error(t('noValidContactsFound'));
      }
      
      // Llamar función de importación
      if (onImportContacts) {
        await onImportContacts(importedContacts);
      }
      
      setImportStatus({
        type: 'success',
        message: t('importSuccess', { count: importedContacts.length })
      });
      
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error.message || t('importError')
      });
    } finally {
      setIsImporting(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Abrir selector de archivo
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Limpiar estado de mensaje
  const clearStatus = () => {
    setImportStatus(null);
  };

  return (
    <div className="csv-manager">
      <div className="csv-manager-header">
        <h3>{t('csvManager')}</h3>
        <p>{t('csvManagerDescription')}</p>
      </div>
      
      <div className="csv-actions">
        {/* Botón de Exportar */}
        <button 
          className="csv-btn csv-btn-export"
          onClick={handleExport}
          disabled={!contacts || contacts.length === 0}
        >
          <span className="csv-btn-icon">📤</span>
          {t('exportCSV')}
        </button>
        
        {/* Botón de Importar */}
        <button 
          className="csv-btn csv-btn-import"
          onClick={handleImportClick}
          disabled={isImporting}
        >
          <span className="csv-btn-icon">
            {isImporting ? '⏳' : '📥'}
          </span>
          {isImporting ? t('importing') : t('importCSV')}
        </button>
        
        {/* Input oculto para archivo */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>
      
      {/* Estado de importación/exportación */}
      {importStatus && (
        <div className={`csv-status csv-status-${importStatus.type}`}>
          <span className="csv-status-icon">
            {importStatus.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="csv-status-message">{importStatus.message}</span>
          <button 
            className="csv-status-close"
            onClick={clearStatus}
            aria-label={t('close')}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Información de formato */}
      <div className="csv-info">
        <details>
          <summary>{t('csvFormatInfo')}</summary>
          <div className="csv-format-details">
            <p>{t('csvFormatDescription')}</p>
            <div className="csv-format-example">
              <h4>{t('csvFormatExample')}</h4>
              <code>
                Nombre,Apellido,Email,Teléfono,Dirección,Categoría,Cumpleaños,Notas<br/>
                Juan,Pérez,juan@email.com,123456789,Calle 123,Trabajo,1990-01-15,Notas del contacto
              </code>
            </div>
            <div className="csv-format-tips">
              <h4>{t('csvFormatTips')}</h4>
              <ul>
                <li>{t('csvTip1')}</li>
                <li>{t('csvTip2')}</li>
                <li>{t('csvTip3')}</li>
                <li>{t('csvTip4')}</li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default CSVManager;