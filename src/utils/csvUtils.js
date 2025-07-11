// Utilidades para importar y exportar contactos en formato CSV

/**
 * Convierte un array de contactos a formato CSV
 * @param {Array} contacts - Array de contactos
 * @returns {string} - Contenido CSV
 */
export const exportToCSV = (contacts) => {
  if (!contacts || contacts.length === 0) {
    return '';
  }

  // Encabezados del CSV
  const headers = [
    'ID',
    'Nombre',
    'Apellido', 
    'Email',
    'Teléfono',
    'Dirección',
    'Categoría',
    'Cumpleaños',
    'Notas',
    'Fecha de Creación'
  ];

  // Convertir contactos a filas CSV
  const rows = contacts.map(contact => [
    contact.id || '',
    contact.firstName || '',
    contact.lastName || '',
    contact.email || '',
    contact.phone || '',
    contact.address || '',
    contact.category || '',
    contact.birthday || '',
    contact.notes || '',
    contact.createdAt || new Date().toISOString()
  ]);

  // Combinar encabezados y filas
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
};

/**
 * Descarga un archivo CSV
 * @param {string} csvContent - Contenido CSV
 * @param {string} filename - Nombre del archivo
 */
export const downloadCSV = (csvContent, filename = 'contactos.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Parsea contenido CSV y lo convierte a array de contactos
 * @param {string} csvContent - Contenido CSV
 * @returns {Array} - Array de contactos
 */
export const parseCSV = (csvContent) => {
  if (!csvContent || csvContent.trim() === '') {
    return [];
  }

  const lines = csvContent.split('\n').filter(line => line.trim() !== '');
  
  if (lines.length < 2) {
    throw new Error('El archivo CSV debe contener al menos una fila de encabezados y una fila de datos');
  }

  // Parsear encabezados
  const headers = parseCSVLine(lines[0]);
  
  // Mapear encabezados a campos esperados
  const fieldMapping = {
    'nombre': 'firstName',
    'apellido': 'lastName',
    'email': 'email',
    'teléfono': 'phone',
    'telefono': 'phone',
    'dirección': 'address',
    'direccion': 'address',
    'categoría': 'category',
    'categoria': 'category',
    'cumpleaños': 'birthday',
    'cumpleanos': 'birthday',
    'notas': 'notes'
  };

  // Parsear filas de datos
  const contacts = [];
  
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      
      if (values.length === 0) continue;
      
      const contact = {
        id: Date.now() + Math.random(), // ID temporal
        createdAt: new Date().toISOString()
      };
      
      // Mapear valores a campos del contacto
      headers.forEach((header, index) => {
        const normalizedHeader = header.toLowerCase().trim();
        const fieldName = fieldMapping[normalizedHeader] || normalizedHeader;
        
        if (values[index] && values[index].trim() !== '') {
          contact[fieldName] = values[index].trim();
        }
      });
      
      // Validar que al menos tenga nombre o email
      if (contact.firstName || contact.email) {
        contacts.push(contact);
      }
    } catch (error) {
      console.warn(`Error procesando línea ${i + 1}:`, error.message);
    }
  }
  
  return contacts;
};

/**
 * Parsea una línea CSV respetando comillas y comas
 * @param {string} line - Línea CSV
 * @returns {Array} - Array de valores
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Comilla escapada
        current += '"';
        i += 2;
      } else {
        // Inicio o fin de comillas
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Separador de campo
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Agregar el último campo
  result.push(current);
  
  return result;
};

/**
 * Valida un archivo CSV antes de importarlo
 * @param {File} file - Archivo a validar
 * @returns {Promise<boolean>} - True si es válido
 */
export const validateCSVFile = async (file) => {
  if (!file) {
    throw new Error('No se ha seleccionado ningún archivo');
  }
  
  if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
    throw new Error('El archivo debe ser de tipo CSV');
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB máximo
    throw new Error('El archivo es demasiado grande. Máximo 5MB permitido');
  }
  
  return true;
};

/**
 * Lee un archivo CSV
 * @param {File} file - Archivo CSV
 * @returns {Promise<string>} - Contenido del archivo
 */
export const readCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
};