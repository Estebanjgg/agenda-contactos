import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './AdvancedSearch.css';

const AdvancedSearch = ({ contacts, onFilteredResults, isVisible, onToggle }) => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    hasAvatar: '',
    notes: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Obtener categorías únicas de los contactos
  const uniqueCategories = [...new Set(contacts.map(contact => contact.categoria).filter(Boolean))];

  // Contar filtros activos
  useEffect(() => {
    const activeCount = Object.values(filters).filter(value => value !== '').length;
    setActiveFiltersCount(activeCount);
  }, [filters]);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    if (activeFiltersCount > 0) {
      const filtered = contacts.filter(contact => {
        // Filtro por nombre
        if (filters.name && !contact.nome.toLowerCase().includes(filters.name.toLowerCase())) {
          return false;
        }

        // Filtro por teléfono
        if (filters.phone && !contact.telefone.includes(filters.phone)) {
          return false;
        }

        // Filtro por email
        if (filters.email && !contact.email.toLowerCase().includes(filters.email.toLowerCase())) {
          return false;
        }

        // Filtro por categoría
        if (filters.category && contact.categoria !== filters.category) {
          return false;
        }

        // Filtro por fecha de creación
        if (filters.dateFrom || filters.dateTo) {
          const contactDate = new Date(contact.id); // Usando ID como timestamp
          if (filters.dateFrom && contactDate < new Date(filters.dateFrom)) {
            return false;
          }
          if (filters.dateTo && contactDate > new Date(filters.dateTo + 'T23:59:59')) {
            return false;
          }
        }

        // Filtro por avatar
        if (filters.hasAvatar !== '') {
          const hasAvatar = Boolean(contact.avatar);
          if (filters.hasAvatar === 'true' && !hasAvatar) {
            return false;
          }
          if (filters.hasAvatar === 'false' && hasAvatar) {
            return false;
          }
        }

        // Filtro por notas
        if (filters.notes && (!contact.notas || !contact.notas.toLowerCase().includes(filters.notes.toLowerCase()))) {
          return false;
        }

        return true;
      });
      onFilteredResults(filtered);
    } else {
      onFilteredResults(contacts);
    }
  }, [filters, contacts, activeFiltersCount, onFilteredResults]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      name: '',
      phone: '',
      email: '',
      category: '',
      dateFrom: '',
      dateTo: '',
      hasAvatar: '',
      notes: ''
    });
  };

  const clearFilter = (field) => {
    setFilters(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  if (!isVisible) {
    return (
      <div className="advanced-search-toggle">
        <button 
          className="toggle-btn"
          onClick={onToggle}
          title={t('advancedSearch')}
        >
          <span className="icon">🔍</span>
          {t('advancedSearch')}
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="advanced-search">
      <div className="advanced-search-header">
        <h3>
          <span className="icon">🔍</span>
          {t('advancedSearch')}
          {activeFiltersCount > 0 && (
            <span className="filter-badge">{activeFiltersCount}</span>
          )}
        </h3>
        <div className="header-actions">
          <button 
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? t('collapse') : t('expand')}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
          <button 
            className="close-btn"
            onClick={onToggle}
            title={t('close')}
          >
            ✕
          </button>
        </div>
      </div>

      <div className={`advanced-search-content ${isExpanded ? 'expanded' : ''}`}>
        <div className="filters-grid">
          {/* Filtro por nombre */}
          <div className="filter-group">
            <label>{t('name')}</label>
            <div className="filter-input-wrapper">
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder={t('searchByName')}
              />
              {filters.name && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('name')}
                  title={t('clear')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por teléfono */}
          <div className="filter-group">
            <label>{t('phone')}</label>
            <div className="filter-input-wrapper">
              <input
                type="text"
                value={filters.phone}
                onChange={(e) => handleFilterChange('phone', e.target.value)}
                placeholder={t('searchByPhone')}
              />
              {filters.phone && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('phone')}
                  title={t('clear')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por email */}
          <div className="filter-group">
            <label>{t('email')}</label>
            <div className="filter-input-wrapper">
              <input
                type="email"
                value={filters.email}
                onChange={(e) => handleFilterChange('email', e.target.value)}
                placeholder={t('searchByEmail')}
              />
              {filters.email && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('email')}
                  title={t('clear')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="filter-group">
            <label>{t('category')}</label>
            <div className="filter-input-wrapper">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">{t('allCategories')}</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {filters.category && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('category')}
                  title={t('clear')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por fecha */}
          <div className="filter-group date-range">
            <label>{t('dateRange')}</label>
            <div className="date-inputs">
              <div className="filter-input-wrapper">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  title={t('dateFrom')}
                />
                {filters.dateFrom && (
                  <button 
                    className="clear-filter-btn"
                    onClick={() => clearFilter('dateFrom')}
                    title={t('clear')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <span className="date-separator">-</span>
              <div className="filter-input-wrapper">
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  title={t('dateTo')}
                />
                {filters.dateTo && (
                  <button 
                    className="clear-filter-btn"
                    onClick={() => clearFilter('dateTo')}
                    title={t('clear')}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filtro por avatar */}
          <div className="filter-group">
            <label>{t('hasAvatar')}</label>
            <div className="filter-input-wrapper">
              <select
                value={filters.hasAvatar}
                onChange={(e) => handleFilterChange('hasAvatar', e.target.value)}
              >
                <option value="">{t('all')}</option>
                <option value="true">{t('withAvatar')}</option>
                <option value="false">{t('withoutAvatar')}</option>
              </select>
              {filters.hasAvatar && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('hasAvatar')}
                  title={t('clear')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filtro por notas */}
          <div className="filter-group">
            <label>{t('notes')}</label>
            <div className="filter-input-wrapper">
              <input
                type="text"
                value={filters.notes}
                onChange={(e) => handleFilterChange('notes', e.target.value)}
                placeholder={t('searchInNotes')}
              />
              {filters.notes && (
                <button 
                  className="clear-filter-btn"
                  onClick={() => clearFilter('notes')}
                  title={t('clear')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="search-actions">
          <button 
            className="clear-all-btn"
            onClick={clearAllFilters}
            disabled={activeFiltersCount === 0}
          >
            <span className="icon">🗑️</span>
            {t('clearAllFilters')}
          </button>
          <div className="results-info">
            {activeFiltersCount > 0 && (
              <span className="active-filters">
                {t('activeFilters')}: {activeFiltersCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;