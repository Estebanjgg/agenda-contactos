# 🚀 Guía de Despliegue - Agenda de Contactos

## Configuración de GitHub Actions

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages usando GitHub Actions.

### 📋 Pasos para configurar el despliegue:

#### 1. Configurar el repositorio en GitHub

1. **Crear repositorio en GitHub** (si no existe)
2. **Subir el código** al repositorio
3. **Configurar GitHub Pages**:
   - Ve a Settings → Pages
   - En "Source", selecciona "GitHub Actions"

#### 2. Actualizar la URL del proyecto

En `package.json`, actualiza la línea `homepage` con tu información:
```json
"homepage": "https://Estebanjgg.github.io/agenda-contactos"
```

Reemplaza `Estebanjgg` con tu nombre de usuario de GitHub.

#### 3. Configurar permisos del repositorio

1. Ve a Settings → Actions → General
2. En "Workflow permissions", selecciona:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"

### 🔄 Proceso de despliegue automático

El workflow se ejecuta automáticamente cuando:
- Se hace push a la rama `main` o `master`
- Se crea un pull request hacia estas ramas

### 📝 Pasos del workflow:

1. **Checkout del código**
2. **Configuración de Node.js 18**
3. **Instalación de dependencias**
4. **Ejecución de tests**
5. **Build del proyecto**
6. **Despliegue a GitHub Pages**
7. **Subida de artefactos de build**

### 🛠️ Comandos manuales disponibles:

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm start

# Ejecutar tests
npm test

# Crear build de producción
npm run build

# Desplegar manualmente (requiere configuración adicional)
npm run deploy
```

### 🔧 Solución de problemas comunes:

#### Error de permisos
- Verifica que los permisos de GitHub Actions estén configurados correctamente
- Asegúrate de que el token GITHUB_TOKEN tenga permisos de escritura

#### Error en tests
- Los tests deben pasar para que el despliegue continúe
- Revisa los logs en la pestaña "Actions" de tu repositorio

#### Error de build
- Verifica que todas las dependencias estén instaladas
- Revisa que no haya errores de sintaxis o imports faltantes

### 📱 Características del proyecto:

- ✅ Progressive Web App (PWA)
- ✅ Responsive design
- ✅ Modo oscuro/claro
- ✅ Internacionalización (i18n)
- ✅ Gestión de contactos con JSON Server
- ✅ Importación/exportación CSV
- ✅ Búsqueda avanzada

### 🌐 URL de acceso

Una vez desplegado, tu aplicación estará disponible en:
`https://Estebanjgg.github.io/agenda-contactos`

---

**Nota**: Recuerda actualizar la URL en el archivo `package.json` con tu nombre de usuario real de GitHub antes del primer despliegue.