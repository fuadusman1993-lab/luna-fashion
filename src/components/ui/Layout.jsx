import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <header className="fixed top-0 w-full bg-luna-black text-luna-white z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-display text-2xl text-gradient-gold font-bold tracking-widest uppercase">
              Luna
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-sm font-medium hover:text-gold transition-colors uppercase tracking-wider">Home</Link>
              <Link to="/shop" className="text-sm font-medium hover:text-gold transition-colors uppercase tracking-wider">Shop</Link>
              <Link to="/admin" className="text-sm font-medium hover:text-gold transition-colors uppercase tracking-wider">Admin</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden text-luna-white hover:text-gold"
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
            className="fixed inset-0 z-[60] bg-luna-black text-luna-white flex flex-col pt-16 px-6"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-5 right-5 text-luna-white hover:text-gold"
            >
              <X className="w-8 h-8" />
            </button>
            
            <nav className="flex flex-col space-y-8 mt-12 text-2xl font-display text-center">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Home</Link>
              <Link to="/shop" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Shop Collection</Link>
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="hover:text-gold transition-colors">Admin Dashboard</Link>
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

      <footer className="bg-luna-black text-luna-white py-12 border-t border-gray-800">
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
