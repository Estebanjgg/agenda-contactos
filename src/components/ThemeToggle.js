import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
      onClick={onToggle}
      title={`Alternar para modo ${isDarkMode ? 'claro' : 'escuro'}`}
    >
      <div className="toggle-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </div>
      <span className="toggle-text">
        {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
      </span>
    </button>
  );
};

export default ThemeToggle;