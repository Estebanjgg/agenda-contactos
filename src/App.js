import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PWAInstaller from './components/PWAInstaller';
import Home from './pages/Home';
import AddContact from './pages/AddContact';
import ViewContacts from './pages/ViewContacts';
import './App.css';
function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Aplicar tema escuro/claro
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <LanguageProvider>
      <Router>
        <div className={`App ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
          <Navbar isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
          
          <main className="App-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/agregar" element={<AddContact />} />
              <Route path="/contactos" element={<ViewContacts />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
        <PWAInstaller />
      </Router>
    </LanguageProvider>
  );
}

export default App;
