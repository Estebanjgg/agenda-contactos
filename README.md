# 📱 Agenda de Contatos - React

Uma aplicação moderna e responsiva para gerenciar contatos, desenvolvida com React e JSON Server.

## 🚀 Funcionalidades

- ✅ **Gestión completa de contactos** - Agregar, editar y eliminar contactos
- 🔍 **Búsqueda avanzada** - Filtros múltiples y búsqueda inteligente
- 📱 **Progressive Web App (PWA)** - Instalable y funciona offline
- 🌙 **Modo oscuro/claro** - Tema personalizable
- 🌐 **Internacionalización** - Soporte multiidioma
- 📊 **Importar/Exportar CSV** - Gestión masiva de contactos
- 🖼️ **Avatares personalizados** - Subida de imágenes de perfil
- 🔄 **Integración API** - Sincronización con servicios externos
- 📱 **Design responsivo** - Interface adaptable para todos los dispositivos
- 🚀 **Despliegue automático** - CI/CD con GitHub Actions

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca JavaScript moderna
- **React Router** - Navegación SPA
- **JSON Server** - API REST para desarrollo
- **CSS3** - Estilos modernos con variables CSS
- **PWA** - Service Workers y Web App Manifest
- **GitHub Actions** - CI/CD automatizado
- **GitHub Pages** - Hosting gratuito
- **i18n** - Internacionalización
- **CSV Parser** - Importación/exportación de datos

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalación y Ejecución

### Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/agenda-contactos.git
cd agenda-contactos

# 2. Instalar dependencias
npm install

# 3. Configurar para GitHub Pages (opcional)
node setup-github-pages.js tu-usuario-github

# 4. Iniciar JSON Server (API)
npm run server

# 5. Iniciar la aplicación (en otra terminal)
npm start
```

### Despliegue en GitHub Pages

1. **Configuración automática**:
   ```bash
   node setup-github-pages.js tu-usuario-github
   ```

2. **Subir a GitHub**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

3. **Configurar repositorio**:
   - Ve a Settings → Pages
   - Selecciona "GitHub Actions" como source
   - Habilita permisos de escritura en Actions

📖 **Guía completa**: Ver [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ContactForm.js      # Formulário para adicionar/editar contatos
│   ├── ContactForm.css     # Estilos do formulário
│   ├── ContactList.js      # Lista de contatos
│   ├── ContactList.css     # Estilos da lista
│   ├── SearchBar.js        # Barra de pesquisa
│   └── SearchBar.css       # Estilos da barra de pesquisa
├── App.js                  # Componente principal
├── App.css                 # Estilos globais
└── index.js               # Ponto de entrada da aplicação
db.json                    # Banco de dados JSON
```

## 🎯 Como Usar

### Adicionar um Contato
1. Preencha o formulário com nome, email e telefone
2. Clique em "Adicionar"
3. O contato aparecerá na lista automaticamente

### Editar um Contato
1. Clique no ícone de edição (✏️) no cartão do contato
2. O formulário será preenchido com os dados atuais
3. Modifique as informações desejadas
4. Clique em "Atualizar" ou "Cancelar"

### Excluir um Contato
1. Clique no ícone de exclusão (🗑️) no cartão do contato
2. Confirme a exclusão na janela de confirmação

### Buscar Contatos
1. Digite na barra de pesquisa
2. A lista será filtrada automaticamente
3. Busca por nome, email ou telefone
4. Clique no "X" para limpar a busca

## 🌐 API Endpoints

O JSON Server cria automaticamente os seguintes endpoints:

- `GET /contatos` - Lista todos os contatos
- `GET /contatos/:id` - Busca um contato específico
- `POST /contatos` - Cria um novo contato
- `PUT /contatos/:id` - Atualiza um contato
- `DELETE /contatos/:id` - Exclui um contato

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop** (1024px+): Layout em duas colunas
- **Tablet** (768px-1023px): Layout em uma coluna
- **Mobile** (até 767px): Interface otimizada para toque

## 🎨 Características do Design

- **Gradientes modernos** - Cores vibrantes e atrativas
- **Animações suaves** - Transições e efeitos hover
- **Cards elegantes** - Contatos exibidos em cartões estilizados
- **Ícones intuitivos** - Interface fácil de entender
- **Feedback visual** - Estados de hover, focus e erro

## 🔒 Validações

- **Nome**: Campo obrigatório
- **Email**: Campo obrigatório com validação de formato
- **Telefone**: Campo obrigatório
- **Confirmação**: Confirmação antes de excluir contatos

## 🚀 Características Implementadas

- ✅ **PWA completa** - Instalable y offline
- ✅ **Modo oscuro/claro** - Tema personalizable
- ✅ **Importar/Exportar CSV** - Gestión masiva
- ✅ **Búsqueda avanzada** - Filtros múltiples
- ✅ **Avatares personalizados** - Subida de imágenes
- ✅ **Internacionalización** - Español/Inglés
- ✅ **Integración API** - Sincronización externa
- ✅ **CI/CD automatizado** - GitHub Actions
- ✅ **Responsive design** - Mobile-first
- ✅ **Validaciones avanzadas** - UX mejorada

## 🔄 Despliegue Automático

Este proyecto incluye:
- **GitHub Actions** para CI/CD
- **Tests automatizados** en cada push
- **Build optimizado** para producción
- **Despliegue automático** a GitHub Pages
- **Artifacts de build** para debugging

## 🌐 Demo en Vivo

🔗 **[Ver Demo](https://tu-usuario.github.io/agenda-contactos)**

## 📄 Licencia

Este proyecto fue desarrollado para fines educacionales y demostrativos.

## 👨‍💻 Desarrollo

Proyecto desarrollado con las mejores prácticas de React, incluyendo:
- Arquitectura de componentes escalable
- Gestión de estado eficiente
- Optimizaciones de rendimiento
- Accesibilidad web (a11y)
- SEO optimizado
- Despliegue automatizado

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Disfruta gestionando tus contactos! 📱✨**
