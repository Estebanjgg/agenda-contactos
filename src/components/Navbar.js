import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import './Navbar.css';

function Navbar({ isDarkMode, onToggleTheme }) {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            📱 {t('home')}
          </Link>
        </div>
        
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-link ${isActive('/') ? 'active' : ''}`}
          >
            🏠 {t('home')}
          </Link>
          <Link 
            to="/agregar" 
            className={`navbar-link ${isActive('/agregar') ? 'active' : ''}`}
          >
            ➕ {t('addContact')}
          </Link>
          <Link 
            to="/contactos" 
            className={`navbar-link ${isActive('/contactos') ? 'active' : ''}`}
          >
            👥 {t('viewContacts')}
          </Link>
        </div>
        
        <div className="navbar-actions">
          <LanguageSelector />
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;