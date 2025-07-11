import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const { t } = useLanguage();
  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('searchContacts')}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            onClick={handleClear}
            className="clear-button"
            title="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="search-info">
          <small>Buscando por: "{searchTerm}"</small>
        </div>
      )}
    </div>
  );
};

export default SearchBar;