// Servicio de API para contactos que funciona en desarrollo y producción
// Usa localStorage como base de datos en producción y JSON Server en desarrollo

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? null // En producción usamos localStorage
  : 'http://localhost:3001';

const STORAGE_KEY = 'agenda_contactos_data';

// Datos iniciales para localStorage
const initialData = {
  contatos: [
    {
      id: "1",
      nome: "João Silva",
      email: "joao.silva@email.com",
      telefone: "(11) 99999-1111",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
      aniversario: "1985-03-15",
      notas: "Colega de trabalho, gosta de futebol",
      categoria: "Trabalho",
      dataCriacao: "2024-01-15T10:30:00Z",
      dataModificacao: "2024-01-15T10:30:00Z"
    },
    {
      id: "2",
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      telefone: "(11) 99999-2222",
      endereco: "Av. Paulista, 456 - São Paulo, SP",
      aniversario: "1990-08-22",
      notas: "Amiga da faculdade, médica",
      categoria: "Amigos",
      dataCriacao: "2024-01-16T14:20:00Z",
      dataModificacao: "2024-01-16T14:20:00Z"
    },
    {
      id: "3",
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      telefone: "(11) 99999-3333",
      endereco: "Rua Augusta, 789 - São Paulo, SP",
      aniversario: "1988-12-10",
      notas: "Desenvolvedor, gosta de tecnologia",
      categoria: "Trabalho",
      dataCriacao: "2024-01-18T16:45:00Z",
      dataModificacao: "2024-01-18T16:45:00Z"
    }
  ]
};

// Funciones para localStorage
const getLocalData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Si no hay datos, inicializar con datos por defecto
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer localStorage:', error);
    return initialData;
  }
};

const setLocalData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error al escribir en localStorage:', error);
    throw new Error('Error al guardar los datos');
  }
};

// Generar ID único
const generateId = () => {
  return Math.random().toString(36).substr(2, 4);
};

// API para desarrollo (JSON Server con fallback a localStorage)
const devAPI = {
  async getContacts() {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos`);
      if (!response.ok) {
        throw new Error('JSON Server no disponible');
      }
      return response.json();
    } catch (error) {
      console.warn('JSON Server no disponible, usando localStorage:', error.message);
      return prodAPI.getContacts();
    }
  },

  async getContact(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos/${id}`);
      if (!response.ok) {
        throw new Error('JSON Server no disponible');
      }
      return response.json();
    } catch (error) {
      console.warn('JSON Server no disponible, usando localStorage:', error.message);
      return prodAPI.getContact(id);
    }
  },

  async createContact(contact) {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contact,
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString()
        }),
      });
      if (!response.ok) {
        throw new Error('JSON Server no disponible');
      }
      return response.json();
    } catch (error) {
      console.warn('JSON Server no disponible, usando localStorage:', error.message);
      return prodAPI.createContact(contact);
    }
  },

  async updateContact(id, contact) {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...contact,
          dataModificacao: new Date().toISOString()
        }),
      });
      if (!response.ok) {
        throw new Error('JSON Server no disponible');
      }
      return response.json();
    } catch (error) {
      console.warn('JSON Server no disponible, usando localStorage:', error.message);
      return prodAPI.updateContact(id, contact);
    }
  },

  async deleteContact(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/contatos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('JSON Server no disponible');
      }
      return true;
    } catch (error) {
      console.warn('JSON Server no disponible, usando localStorage:', error.message);
      return prodAPI.deleteContact(id);
    }
  }
};

// API para producción (localStorage)
const prodAPI = {
  async getContacts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData();
        resolve(data.contatos);
      }, 100); // Simular latencia de red
    });
  },

  async getContact(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getLocalData();
        const contact = data.contatos.find(c => c.id === id);
        if (contact) {
          resolve(contact);
        } else {
          reject(new Error('Contacto no encontrado'));
        }
      }, 100);
    });
  },

  async createContact(contact) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getLocalData();
        const newContact = {
          ...contact,
          id: generateId(),
          dataCriacao: new Date().toISOString(),
          dataModificacao: new Date().toISOString()
        };
        data.contatos.push(newContact);
        setLocalData(data);
        resolve(newContact);
      }, 100);
    });
  },

  async updateContact(id, contact) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getLocalData();
        const index = data.contatos.findIndex(c => c.id === id);
        if (index !== -1) {
          data.contatos[index] = {
            ...contact,
            id,
            dataModificacao: new Date().toISOString()
          };
          setLocalData(data);
          resolve(data.contatos[index]);
        } else {
          reject(new Error('Contacto no encontrado'));
        }
      }, 100);
    });
  },

  async deleteContact(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = getLocalData();
        const index = data.contatos.findIndex(c => c.id === id);
        if (index !== -1) {
          data.contatos.splice(index, 1);
          setLocalData(data);
          resolve(true);
        } else {
          reject(new Error('Contacto no encontrado'));
        }
      }, 100);
    });
  }
};

// API unificada que selecciona automáticamente entre desarrollo y producción
const contactsAPI = process.env.NODE_ENV === 'production' ? prodAPI : devAPI;

export default contactsAPI;

// Funciones de utilidad adicionales
export const exportContacts = () => {
  const data = getLocalData();
  return data.contatos;
};

export const importContacts = (contacts) => {
  const data = getLocalData();
  data.contatos = contacts.map(contact => ({
    ...contact,
    id: contact.id || generateId(),
    dataCriacao: contact.dataCriacao || new Date().toISOString(),
    dataModificacao: new Date().toISOString()
  }));
  setLocalData(data);
  return data.contatos;
};

export const resetData = () => {
  localStorage.removeItem(STORAGE_KEY);
  return getLocalData(); // Esto reinicializará con datos por defecto
};