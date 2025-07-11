import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './AvatarUploader.css';

const AvatarUploader = ({ currentAvatar, onAvatarChange, contactName = '' }) => {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar || null);
  const fileInputRef = useRef(null);

  // Generar avatar con iniciales
  const generateInitialsAvatar = (name) => {
    if (!name) return null;
    
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    
    const colorIndex = name.length % colors.length;
    const backgroundColor = colors[colorIndex];
    
    // Crear canvas para generar imagen
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 120;
    canvas.height = 120;
    
    // Fondo circular
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(60, 60, 60, 0, 2 * Math.PI);
    ctx.fill();
    
    // Texto de iniciales
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, 60, 60);
    
    return canvas.toDataURL('image/png');
  };

  // Manejar selección de archivo
  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert(t('invalidImageType'));
      return;
    }
    
    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert(t('imageTooLarge'));
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Redimensionar imagen
      const resizedImage = await resizeImage(file, 120, 120);
      setPreviewUrl(resizedImage);
      
      if (onAvatarChange) {
        onAvatarChange(resizedImage);
      }
    } catch (error) {
      console.error('Error procesando imagen:', error);
      alert(t('imageProcessError'));
    } finally {
      setIsUploading(false);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Redimensionar imagen
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = maxWidth;
        canvas.height = maxHeight;
        
        // Centrar imagen en canvas
        const x = (maxWidth - width) / 2;
        const y = (maxHeight - height) / 2;
        
        // Fondo blanco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, maxWidth, maxHeight);
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, x, y, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Generar avatar con iniciales
  const handleGenerateInitials = () => {
    const initialsAvatar = generateInitialsAvatar(contactName);
    if (initialsAvatar) {
      setPreviewUrl(initialsAvatar);
      if (onAvatarChange) {
        onAvatarChange(initialsAvatar);
      }
    }
  };

  // Eliminar avatar
  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    if (onAvatarChange) {
      onAvatarChange(null);
    }
  };

  // Abrir selector de archivo
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="avatar-uploader">
      <div className="avatar-preview">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt={t('contactAvatar')} 
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            <span className="avatar-placeholder-icon">👤</span>
          </div>
        )}
        
        {isUploading && (
          <div className="avatar-loading">
            <div className="avatar-spinner"></div>
          </div>
        )}
      </div>
      
      <div className="avatar-actions">
        <button 
          type="button"
          className="avatar-btn avatar-btn-upload"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          📷 {t('uploadPhoto')}
        </button>
        
        {contactName && (
          <button 
            type="button"
            className="avatar-btn avatar-btn-initials"
            onClick={handleGenerateInitials}
            disabled={isUploading}
          >
            🔤 {t('generateInitials')}
          </button>
        )}
        
        {previewUrl && (
          <button 
            type="button"
            className="avatar-btn avatar-btn-remove"
            onClick={handleRemoveAvatar}
            disabled={isUploading}
          >
            🗑️ {t('removePhoto')}
          </button>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      
      <div className="avatar-info">
        <small>{t('avatarInfo')}</small>
      </div>
    </div>
  );
};

export default AvatarUploader;