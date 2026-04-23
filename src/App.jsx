import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Admin from './pages/Admin';
import About from './pages/About';
import Contact from './pages/Contact';
import Me from './pages/Me';
import Cart from './pages/Cart';
import ProductDetail from './pages/ProductDetail';
import Onboarding from './components/ui/Onboarding';
import Messages from './pages/Messages';
import Login from './pages/Login';
import SearchPage from './pages/SearchPage';
import Settings from './pages/Settings';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import { useAppContext } from './context/AppContext';
import { ShoppingBag } from 'lucide-react';

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toastMessage } = useAppContext();

  useEffect(() => {
    const onboarded = localStorage.getItem('luna_onboarded');
    if (!onboarded) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('luna_onboarded', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category" element={<Shop />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="me" element={<Me />} />
            <Route path="cart" element={<Cart />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </BrowserRouter>

      {/* Global Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed top-[60px] left-1/2 -translate-x-1/2 z-[10000] bg-[#111111] text-white px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center space-x-3 transition-all animate-bounce border border-[#D4AF37]/30 pointer-events-none">
          <ShoppingBag className="w-[14px] h-[14px] text-[#D4AF37]" strokeWidth={2.5} />
          <span className="text-[12px] font-bold tracking-wider text-nowrap">{toastMessage}</span>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
