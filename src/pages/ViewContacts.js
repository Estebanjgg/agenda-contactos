import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import AdvancedSearch from '../components/AdvancedSearch';
import CSVManager from '../components/CSVManager';
import APIIntegration from '../components/APIIntegration';
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
      const response = await fetch('http://localhost:3001/contatos');
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
        setError('');
      } else {
        throw new Error('Error al cargar los contactos');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudieron cargar los contactos. Verifica que el servidor esté funcionando.');
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
      const response = await fetch(`http://localhost:3001/contatos/${editingContact.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contactData,
          dataModificacao: new Date().toISOString()
        }),
      });

      if (response.ok) {
        await fetchContacts();
        setEditingContact(null);
      } else {
        throw new Error('Error al actualizar el contacto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el contacto');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        const response = await fetch(`http://localhost:3001/contatos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchContacts();
        } else {
          throw new Error('Error al eliminar el contacto');
        }
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
        const response = await fetch('http://localhost:3001/contatos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...contact,
            dataCriacao: new Date().toISOString(),
            dataModificacao: new Date().toISOString()
          })
        });
        
        if (response.ok) {
          const newContact = await response.json();
          addedContacts.push(newContact);
        }
      }
      
      // Actualizar la lista de contactos
      await fetchContacts();
      
      alert(`Se importaron ${addedContacts.length} contactos exitosamente`);
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al importar contactos');
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
          name: externalContact.name,
          phone: externalContact.phone || '',
          email: externalContact.email || '',
          category: externalContact.category || 'Personal',
          notes: externalContact.notes || '',
          avatar: externalContact.avatar || null,
          dateAdded: new Date().toISOString().split('T')[0]
        };
        
        const response = await fetch('http://localhost:3001/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newContact),
        });
        
        if (response.ok) {
          const addedContact = await response.json();
          setContacts(prevContacts => [...prevContacts, addedContact]);
        }
      }
      
      setExternalContacts(externalContactsData);
    } catch (error) {
      console.error('Error syncing external contacts:', error);
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