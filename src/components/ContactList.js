import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './ContactList.css';

const ContactList = ({ contacts, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState('nome');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterCategory, setFilterCategory] = useState('Todas');

  const categorias = ['Todas', 'Geral', 'Família', 'Amigos', 'Trabalho', 'Outros'];

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const sortedAndFilteredContacts = contacts
    .filter(contact => {
      if (filterCategory === 'Todas') return true;
      return contact.categoria === filterCategory;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'nome':
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
          break;
        case 'categoria':
          aValue = a.categoria || 'Geral';
          bValue = b.categoria || 'Geral';
          break;
        case 'dataCriacao':
          aValue = new Date(a.dataCriacao || 0);
          bValue = new Date(b.dataCriacao || 0);
          break;
        case 'dataModificacao':
          aValue = new Date(a.dataModificacao || 0);
          bValue = new Date(b.dataModificacao || 0);
          break;
        default:
          aValue = a.nome.toLowerCase();
          bValue = b.nome.toLowerCase();
      }
      
      if (sortBy === 'dataCriacao' || sortBy === 'dataModificacao') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  const handleDelete = (contact) => {
    if (window.confirm(t('confirmDelete').replace('{name}', contact.nome))) {
      onDelete(contact.id);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="contact-list-container">
        <h2>📋 Lista de Contatos</h2>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>{t('noContacts')}</p>
          <small>{t('addFirstContact')}</small>
        </div>
      </div>
    );
  }

  if (sortedAndFilteredContacts.length === 0) {
    return (
      <div className="contact-list-container">
        <h2>📋 Lista de Contatos ({contacts.length})</h2>
        
        <div className="list-controls">
          <div className="filter-group">
            <label>Filtrar por categoria:</label>
            <select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="sort-group">
            <label>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="nome">Nome</option>
              <option value="categoria">Categoria</option>
              <option value="dataCriacao">Data de Criação</option>
              <option value="dataModificacao">Última Modificação</option>
            </select>
            
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="sort-order-btn"
              title={`Ordenação ${sortOrder === 'asc' ? 'crescente' : 'decrescente'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>Nenhum contato encontrado para a categoria "{filterCategory}"</p>
          <small>Tente selecionar uma categoria diferente</small>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-list-container">
      <h2>📋 Lista de Contatos ({contacts.length})</h2>
      
      <div className="list-controls">
        <div className="filter-group">
          <label>Filtrar por categoria:</label>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="sort-group">
          <label>Ordenar por:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="nome">Nome</option>
            <option value="categoria">Categoria</option>
            <option value="dataCriacao">Data de Criação</option>
            <option value="dataModificacao">Última Modificação</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
            title={`Ordenação ${sortOrder === 'asc' ? 'crescente' : 'decrescente'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
      
      <div className="contacts-grid">
        {sortedAndFilteredContacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <div className="contact-header">
              <div className="contact-avatar">
                {contact.avatar ? (
                  <img 
                    src={contact.avatar} 
                    alt={contact.nome}
                    className="avatar-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="avatar-initials"
                  style={{ display: contact.avatar ? 'none' : 'flex' }}
                >
                  {contact.nome.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="contact-category-badge">
                {contact.categoria || 'Geral'}
              </div>
            </div>
            
            <div className="contact-info">
              <h3 className="contact-name">{contact.nome}</h3>
              
              <div className="contact-detail">
                <span className="contact-icon">📧</span>
                <span className="contact-text">{contact.email}</span>
              </div>
              
              <div className="contact-detail">
                <span className="contact-icon">📞</span>
                <span className="contact-text">{contact.telefone}</span>
              </div>
              
              {contact.endereco && (
                <div className="contact-detail">
                  <span className="contact-icon">📍</span>
                  <span className="contact-text">{contact.endereco}</span>
                </div>
              )}
              
              {contact.aniversario && (
                <div className="contact-detail">
                  <span className="contact-icon">🎂</span>
                  <span className="contact-text">
                    {formatDate(contact.aniversario)}
                    {calculateAge(contact.aniversario) && (
                      <span className="age-info"> ({calculateAge(contact.aniversario)} anos)</span>
                    )}
                  </span>
                </div>
              )}
              
              {contact.notas && (
                <div className="contact-detail contact-notes">
                  <span className="contact-icon">📝</span>
                  <span className="contact-text">{contact.notas}</span>
                </div>
              )}
            </div>
            
            <div className="contact-actions">
              <button 
                onClick={() => onEdit(contact)}
                className="btn btn-edit"
                title={t('editContact')}
              >
                ✏️
              </button>
              
              <button 
                onClick={() => handleDelete(contact)}
                className="btn btn-delete"
                title={t('deleteContact')}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactList;