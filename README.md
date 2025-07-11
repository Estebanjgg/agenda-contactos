# 📱 Agenda de Contatos - React

Uma aplicação moderna e responsiva para gerenciar contatos, desenvolvida com React e JSON Server.

## 🚀 Funcionalidades

- ✅ **Adicionar contatos** - Cadastre novos contatos com nome, email e telefone
- ✏️ **Editar contatos** - Atualize informações de contatos existentes
- 🗑️ **Excluir contatos** - Remova contatos com confirmação
- 🔍 **Buscar contatos** - Pesquise por nome, email ou telefone
- 📱 **Design responsivo** - Interface adaptável para desktop e mobile
- 🎨 **Interface moderna** - Design atrativo com gradientes e animações

## 🛠️ Tecnologias Utilizadas

- **React** - Biblioteca JavaScript para construção da interface
- **JSON Server** - API REST falsa para desenvolvimento
- **CSS3** - Estilização moderna com gradientes e animações
- **Fetch API** - Para requisições HTTP

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação e Execução

### 1. Clone ou baixe o projeto
```bash
cd agenda-contactos
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o JSON Server (API)
```bash
npm run server
```
O servidor da API estará disponível em: `http://localhost:3001`

### 4. Em outro terminal, inicie a aplicação React
```bash
npm start
```
A aplicação estará disponível em: `http://localhost:3000`

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

## 🚀 Possíveis Melhorias

- [ ] Adicionar mais campos (endereço, data de nascimento)
- [ ] Implementar ordenação (alfabética, data de criação)
- [ ] Adicionar categorias/grupos de contatos
- [ ] Exportar contatos (CSV, JSON)
- [ ] Importar contatos
- [ ] Backup automático
- [ ] Modo escuro
- [ ] Integração com APIs reais

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais como parte do curso de React.

## 👨‍💻 Desenvolvedor

Projeto desenvolvido seguindo as especificações do curso de React, implementando uma agenda de contatos completa e funcional.

---

**Divirta-se gerenciando seus contatos! 📱✨**
