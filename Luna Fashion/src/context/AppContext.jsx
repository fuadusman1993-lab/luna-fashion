import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locale/translations';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  // Language State
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  // Apply Theme class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync language to local storage
  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(language === 'en' ? 'am' : 'en');
  
  // Translator function
  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
