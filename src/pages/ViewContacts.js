import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AdvancedSearch from '../components/AdvancedSearch';
import CSVManager from '../components/CSVManager';
import APIIntegration from '../components/APIIntegration';
import contactsAPI from '../services/contactsAPI';
import './ViewContacts.css';

function ViewContacts() {
  const { t } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingContact, setEditingContact] = useState(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedFilteredContacts, setAdvancedFilteredContacts] = useState([]);
  const [showAPIIntegration, setShowAPIIntegration] = useState(false);
  const [externalContacts, setExternalContacts] = useState([]);

  // Cargar contactos de la API
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await contactsAPI.getContacts();
      setContacts(data);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error al cargar los contactos.');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar contactos baseado no termo de busca (solo cuando no hay búsqueda avanzada activa)
  useEffect(() => {
    if (showAdvancedSearch) {
      return; // No aplicar filtros básicos si la búsqueda avanzada está activa
    }

    const filtered = contacts.filter(contact =>
      contact.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.telefone.includes(searchTerm) ||
      (contact.endereco && contact.endereco.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.notas && contact.notas.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (contact.categoria && contact.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm, showAdvancedSearch]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
  };

  const handleUpdate = async (contactData) => {
    try {
      await contactsAPI.updateContact(editingContact.id, contactData);
      await fetchContacts();
      setEditingContact(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el contacto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await contactsAPI.deleteContact(id);
        await fetchContacts();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el contacto');
      }
    }
  };

  // Función para importar contactos desde CSV
  const handleImportContacts = async (importedContacts) => {
    try {
      const addedContacts = [];
      
      for (const contact of importedContacts) {
        try {
          const newContact = await contactsAPI.createContact(contact);
          addedContacts.push(newContact);
        } catch (error) {
          console.error('Error adding contact:', error);
        }
      }
      
      if (addedContacts.length > 0) {
        await fetchContacts();
        setError('');
        alert(`${addedContacts.length} contactos importados exitosamente`);
      } else {
        setError('No se pudieron importar los contactos');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al importar contactos');
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleAdvancedSearchResults = (results) => {
    setAdvancedFilteredContacts(results);
  };

  const toggleAdvancedSearch = () => {
    setShowAdvancedSearch(!showAdvancedSearch);
    if (showAdvancedSearch) {
      // Al cerrar búsqueda avanzada, volver a filtros básicos
      setAdvancedFilteredContacts([]);
    }
  };

  const toggleAPIIntegration = () => {
    setShowAPIIntegration(!showAPIIntegration);
  };

  const handleExternalSync = async (externalContactsData) => {
    try {
      // Procesar contactos externos y agregarlos a la base de datos
      for (const externalContact of externalContactsData) {
        const newContact = {
          nome: externalContact.name || externalContact.nome,
          email: externalContact.email,
          telefone: externalContact.phone || externalContact.telefone,
          endereco: externalContact.address || externalContact.endereco || '',
          aniversario: externalContact.birthday || externalContact.aniversario || '',
          notas: externalContact.notes || externalContact.notas || 'Sincronizado desde API externa',
          categoria: externalContact.category || externalContact.categoria || 'Geral'
        };

        try {
          await contactsAPI.createContact(newContact);
        } catch (error) {
          console.error('Error al sincronizar contacto:', externalContact, error);
        }
      }

      // Recargar contactos después de la sincronización
      await fetchContacts();
      setError('');
    } catch (error) {
      console.error('Error en sincronización externa:', error);
      setError('Error al sincronizar contactos externos');
    }
  };

  // Determinar qué contactos mostrar
  const contactsToShow = showAdvancedSearch ? advancedFilteredContacts : filteredContacts;

  if (loading) {
    return (
      <div className="view-contacts-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-contacts-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>{t('error')}</h2>
          <p>{error}</p>
          <button onClick={fetchContacts} className="retry-button">
            🔄 {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-contacts-container">
      <div className="view-contacts-content">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              👥 {t('viewContactsTitle')}
            </h1>
            <p className="page-subtitle">
              {contacts.length === 0 
                ? 'No tienes contactos aún. ¡Agrega tu primer contacto!'
                : `Tienes ${contacts.length} contacto${contacts.length !== 1 ? 's' : ''} en tu agenda`
              }
            </p>
          </div>
          
          <div className="header-actions">
            <CSVManager 
          contacts={contacts} 
          onImportContacts={handleImportContacts}
        />
        
        <button 
          className="api-integration-toggle"
          onClick={toggleAPIIntegration}
          title={t('apiIntegration')}
        >
          🔗 {t('apiIntegration')}
        </button>
        
        {showAPIIntegration && (
          <APIIntegration 
            contacts={contacts}
            onExternalSync={handleExternalSync}
          />
        )}
            <Link to="/agregar" className="add-contact-btn">
              ➕ {t('addNewContactBtn')}
            </Link>
          </div>
        </div>

        {contacts.length === 0 ? (
          <div className="empty-contacts-state">
            <div className="empty-icon">📱</div>
            <h2>{t('noContacts')}</h2>
            <p>{t('getStarted')}</p>
            <Link to="/agregar" className="cta-button">
              ➕ {t('addNewContact')}
            </Link>
          </div>
        ) : (
          <div className="contacts-section">
            <div className="search-section">
              {!showAdvancedSearch && (
                <SearchBar 
                  onSearch={handleSearch} 
                  contactsCount={filteredContacts.length}
                  totalContacts={contacts.length}
                />
              )}
              
              <AdvancedSearch
                contacts={contacts}
                onFilteredResults={handleAdvancedSearchResults}
                isVisible={showAdvancedSearch}
                onToggle={toggleAdvancedSearch}
              />
            </div>
            
            <div className="contacts-list-section">
              <ContactList
                contacts={contactsToShow}
                onEdit={handleEdit}
                onDelete={handleDelete}
                editingContact={editingContact}
                onUpdate={handleUpdate}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewContacts;