import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();
  const location = useLocation();

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('shop'), path: '/shop' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
    { name: t('admin'), path: '/admin' }
  ];

  return (
    <div className="min-h-screen flex flex-col pt-16 transition-colors duration-300 dark:bg-luna-black bg-luna-white">
      {/* Sticky Navbar */}
      <header className="fixed top-0 w-full bg-luna-black dark:bg-black text-luna-white z-50 shadow-md border-b border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-display text-2xl text-gradient-gold font-bold tracking-widest uppercase">
              Luna
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`text-sm font-medium hover:text-gold uppercase tracking-wider transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-gray-300'}`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="w-px h-6 bg-gray-700 mx-2"></div>
              
              <button onClick={toggleLanguage} className="flex items-center space-x-1 text-gray-300 hover:text-gold transition-colors text-sm font-medium uppercase">
                 <Globe className="w-4 h-4" />
                 <span>{language === 'en' ? 'AM' : 'EN'}</span>
              </button>
              
              <button onClick={toggleTheme} className="text-gray-300 hover:text-gold transition-colors">
                 {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </nav>

            <div className="flex items-center space-x-4 md:hidden">
              <button onClick={toggleLanguage} className="text-luna-white hover:text-gold flex items-center text-sm font-medium uppercase">
                 <span>{language === 'en' ? 'AM' : 'EN'}</span>
              </button>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-luna-white hover:text-gold"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed inset-0 z-[60] bg-luna-black dark:bg-black text-luna-white flex flex-col pt-16 px-6"
          >
            <div className="absolute top-5 right-5 flex items-center space-x-6">
              <button onClick={toggleTheme} className="text-gray-300 hover:text-gold transition-colors">
                 {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="text-luna-white hover:text-gold"
              >
                <X className="w-8 h-8" />
              </button>
            </div>
            
            <nav className="flex flex-col space-y-8 mt-12 text-2xl font-display text-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`hover:text-gold transition-colors ${location.pathname === link.path ? 'text-gold' : ''}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            
            <div className="mt-auto mb-10 text-center text-sm text-gray-400">
              <p>Sun Moon Star Mall Jemo 1, Addis Ababa</p>
              <p>Shop Number 06, 1st floor</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-luna-black dark:bg-black text-luna-white py-12 border-t border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-gradient-gold mb-4">Luna Fashion</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8 font-light">
            Elegance crafted for the modern woman. Discover luxury, comfort, and style all in one place.
          </p>
          <div className="text-sm text-gray-500 font-light">
            &copy; {new Date().getFullYear()} Luna Fashion House. All rights reserved. <br/>
            Addis Ababa, Ethiopia.
          </div>
        </div>
      </footer>
    </div>
  );
}
