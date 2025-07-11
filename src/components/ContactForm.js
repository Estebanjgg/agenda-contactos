import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import AvatarUploader from './AvatarUploader';
import './ContactForm.css';

const ContactForm = ({ onSubmit, editingContact, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    aniversario: '',
    notas: '',
    categoria: 'Geral',
    avatar: null
  });

  const categorias = ['Geral', 'Família', 'Amigos', 'Trabalho', 'Outros'];

  const [errors, setErrors] = useState({});

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingContact) {
      setFormData({
        nome: editingContact.nome || '',
        email: editingContact.email || '',
        telefone: editingContact.telefone || '',
        endereco: editingContact.endereco || '',
        aniversario: editingContact.aniversario || '',
        notas: editingContact.notas || '',
        categoria: editingContact.categoria || 'Geral',
        avatar: editingContact.avatar || null
      });
    } else {
      setFormData({ 
        nome: '', 
        email: '', 
        telefone: '', 
        endereco: '', 
        aniversario: '', 
        notas: '', 
        categoria: 'Geral',
        avatar: null
      });
    }
    setErrors({});
  }, [editingContact]);

  const validatePhone = (phone) => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem pelo menos 10 dígitos (telefone fixo) ou 11 (celular)
    if (cleanPhone.length < 10 || cleanPhone.length > 11) {
      return false;
    }
    
    // Verifica se é um número válido (não pode começar com 0 ou 1)
    if (cleanPhone.length === 11 && !['2', '3', '4', '5', '6', '7', '8', '9'].includes(cleanPhone[2])) {
      return false;
    }
    
    return true;
  };

  const formatPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = t('nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = t('phoneRequired');
    } else if (!validatePhone(formData.telefone)) {
      newErrors.telefone = t('phoneInvalid');
    }

    // Validação de data de aniversário
    if (formData.aniversario) {
      const today = new Date();
      const birthDate = new Date(formData.aniversario);
      if (birthDate > today) {
        newErrors.aniversario = t('birthdayInvalid');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatação automática do telefone
    if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAvatarChange = (avatarData) => {
    setFormData(prev => ({
      ...prev,
      avatar: avatarData
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      dataModificacao: new Date().toISOString()
    };

    if (!editingContact) {
      submitData.dataCriacao = new Date().toISOString();
    }

    if (editingContact) {
      onSubmit(editingContact.id, submitData);
    } else {
      onSubmit(submitData);
    }

    // Limpar formulário após envio (apenas se não estiver editando)
    if (!editingContact) {
      setFormData({ 
        nome: '', 
        email: '', 
        telefone: '', 
        endereco: '', 
        aniversario: '', 
        notas: '', 
        categoria: 'Geral',
        avatar: null
      });
    }
  };

  const handleCancel = () => {
    setFormData({ 
      nome: '', 
      email: '', 
      telefone: '', 
      endereco: '', 
      aniversario: '', 
      notas: '', 
      categoria: 'Geral',
      avatar: null
    });
    setErrors({});
    onCancel();
  };

  return (
    <div className="contact-form-container">
      <h2>{editingContact ? t('editContact') : t('contactForm')}</h2>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <AvatarUploader
          currentAvatar={formData.avatar}
          contactName={formData.nome}
          onAvatarChange={handleAvatarChange}
        />
        
        <div className="form-group">
          <label htmlFor="nome">{t('name')}:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? 'error' : ''}
            placeholder={t('name')}
          />
          {errors.nome && <span className="error-message">{errors.nome}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('email')}:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder={t('email')}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="telefone">{t('phone')}:</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            className={errors.telefone ? 'error' : ''}
            placeholder={t('phone')}
          />
          {errors.telefone && <span className="error-message">{errors.telefone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endereco">{t('address')}:</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            placeholder={t('address')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="aniversario">{t('birthday')}:</label>
          <input
            type="date"
            id="aniversario"
            name="aniversario"
            value={formData.aniversario}
            onChange={handleChange}
            className={errors.aniversario ? 'error' : ''}
          />
          {errors.aniversario && <span className="error-message">{errors.aniversario}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="categoria">{t('category')}:</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="form-select"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{t(cat.toLowerCase())}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="notas">{t('notes')}:</label>
          <textarea
            id="notas"
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            placeholder={t('notes')}
            rows="3"
            className="form-textarea"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            {editingContact ? t('update') : t('save')}
          </button>
          
          {editingContact && (
            <button type="button" onClick={handleCancel} className="btn btn-secondary">
              {t('cancel')}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactForm;