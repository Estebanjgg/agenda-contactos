import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import './Home.css';

function Home() {
  const { t } = useLanguage();
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            📱 {t('welcome')}
          </h1>
          <p className="hero-subtitle">
            {t('subtitle')}
          </p>
          
          <div className="hero-features">
            <div className="feature-card">
              <div className="feature-icon">➕</div>
              <h3>{t('addContactsFeature')}</h3>
              <p>{t('addContactsDesc')}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>{t('searchFilterFeature')}</h3>
              <p>{t('searchFilterDesc')}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📂</div>
              <h3>{t('categoriesFeature')}</h3>
              <p>{t('categoriesDesc')}</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🌙</div>
              <h3>{t('darkModeFeature')}</h3>
              <p>{t('darkModeDesc')}</p>
            </div>
          </div>
          
          <div className="hero-actions">
            <Link to="/agregar" className="cta-button primary">
              ➕ {t('addNewContact')}
            </Link>
            <Link to="/contactos" className="cta-button secondary">
              👥 {t('viewAllContacts')}
            </Link>
          </div>
        </div>
        
        <div className="hero-illustration">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="contact-preview">
                <div className="contact-item">
                  <div className="contact-avatar">👤</div>
                  <div className="contact-info">
                    <div className="contact-name">María García</div>
                    <div className="contact-phone">+1 234 567 8900</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-avatar">👨</div>
                  <div className="contact-info">
                    <div className="contact-name">Juan Pérez</div>
                    <div className="contact-phone">+1 234 567 8901</div>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-avatar">👩</div>
                  <div className="contact-info">
                    <div className="contact-name">Ana López</div>
                    <div className="contact-phone">+1 234 567 8902</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">{t('unlimitedContacts')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">⚡</div>
            <div className="stat-label">{t('instantSearch')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">🔒</div>
            <div className="stat-label">{t('secureData')}</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">📱</div>
            <div className="stat-label">{t('responsiveDesign')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;