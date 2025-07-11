import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import ContactForm from '../components/ContactForm';
import contactsAPI from '../services/contactsAPI';
import './AddContact.css';

function AddContact() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleContactAdded = async (contactData) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      await contactsAPI.createContact(contactData);
      setSubmitMessage(t('contactAdded'));
      setTimeout(() => {
        navigate('/contactos');
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      setSubmitMessage(t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/contactos');
  };

  return (
    <div className="add-contact-container">
      <div className="add-contact-content">
        <div className="page-header">
          <h1 className="page-title">
            ➕ {t('addContactTitle')}
          </h1>
          <p className="page-subtitle">
            {t('addContactSubtitle')}
          </p>
        </div>

        <div className="form-wrapper">
          <div className="form-container">
            <ContactForm
              onSubmit={handleContactAdded}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              submitButtonText={isSubmitting ? 'Agregando...' : 'Agregar Contacto'}
            />
            
            {submitMessage && (
              <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
                {submitMessage}
              </div>
            )}
          </div>
          
          <div className="help-section">
            <div className="help-card">
              <h3>💡 {t('helpTitle')}</h3>
              <ul>
                <li>{t('helpTip1')}</li>
                <li>{t('helpTip2')}</li>
                <li>{t('helpTip3')}</li>
                <li>{t('helpTip4')}</li>
                <li>{t('helpTip5')}</li>
              </ul>
            </div>
            
            <div className="help-card">
              <h3>🔍 {t('afterAddingTitle')}</h3>
              <ul>
                <li>{t('afterAddingTip1')}</li>
                <li>{t('afterAddingTip2')}</li>
                <li>{t('afterAddingTip3')}</li>
                <li>{t('afterAddingTip4')}</li>
                <li>{t('afterAddingTip5')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddContact;