import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locale/translations';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  
  // Language State
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  // Wishlist State
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('luna_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('luna_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  // Apply Theme class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync wishlist to local storage
  useEffect(() => {
    localStorage.setItem('luna_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('luna_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync language to local storage
  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = () => setLanguage(language === 'en' ? 'am' : 'en');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const toggleWishlist = (productId) => {
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    setToastMessage(`${product.name} Added To Cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isInWishlist = (productId) => wishlist.includes(productId);
  
  // Translator function
  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    theme,
    toggleTheme,
    language,
    toggleLanguage,
    t,
    wishlist,
    toggleWishlist,
    isInWishlist,
    cart,
    addToCart,
    toastMessage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
