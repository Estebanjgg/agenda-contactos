import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t, language } = useLanguage();
  
  // Debug: verificar si las traducciones funcionan
  console.log('Current language:', language);
  console.log('contact.title translation:', t('contact.title'));
  console.log('social.title translation:', t('social.title'));

  const contactInfo = {
    email: 'Esteban030994@gmail.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://www.linkedin.com/in/esteban-jose-gonzalez-gomez-63271422b/',
    github: 'https://github.com/Estebanjgg',
    website: 'https://portafolio-esteban.lat/'
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">{t('contact.title')}</h3>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <a href={`mailto:${contactInfo.email}`} className="contact-link">
                {contactInfo.email}
              </a>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <a href={`tel:${contactInfo.phone}`} className="contact-link">
                {contactInfo.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('social.title')}</h3>
          <div className="social-links">
            <a 
              href={contactInfo.linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a 
              href={contactInfo.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="GitHub"
            >
              <i className="fab fa-github"></i>
            </a>
            <a 
              href={contactInfo.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link"
              aria-label="Website"
            >
              <i className="fas fa-globe"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">{t('app.title')}</h3>
          <p className="footer-description">
            {t('app.description')}
          </p>
          <p className="footer-version">
            {t('app.version')} 1.0.0
          </p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="footer-copyright">
          © {new Date().getFullYear()} Esteban Developer. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;