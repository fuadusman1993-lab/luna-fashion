import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import Privacy from './pages/Privacy';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import SplashScreen from './components/ui/SplashScreen';
import { useAppContext } from './context/AppContext';
import { ShoppingBag } from 'lucide-react';
import { logPageView, sendActiveHeartbeat } from './services/analytics';

let initialLoadComplete = false;

function AppContent() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { toastMessage } = useAppContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding') === 'true';
    const oldOnboarded = localStorage.getItem('luna_onboarded') === 'true';

    // ALWAYS show a quick splash screen on initial startup for the app feel
    setShowSplash(true);

    if (hasSeenOnboarding || oldOnboarded) {
      setShowOnboarding(false);
      if (oldOnboarded) localStorage.setItem('hasSeenOnboarding', 'true');
    } else {
      // Show Onboarding after splash for new users
      setShowOnboarding(true);
    }
    
    initialLoadComplete = true;
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    if (!isInitializing && !showSplash && !showOnboarding) {
      // Set the Flag safely if they reached Home
      if (location.pathname === '/') {
        localStorage.setItem('hasSeenOnboarding', 'true');
      }
      
      // Log Analytics Page View (skip admin paths to avoid skewed stats)
      if (!location.pathname.startsWith('/admin')) {
        logPageView(location.pathname);
      }
    }
  }, [location, isInitializing, showSplash, showOnboarding]);

  // Analytics Heartbeat Setup (120 seconds)
  useEffect(() => {
    if (isInitializing || showSplash || showOnboarding) return;
    
    // Send immediate initial heartbeat
    sendActiveHeartbeat();
    
    const interval = setInterval(() => {
      sendActiveHeartbeat();
    }, 120000);
    
    return () => clearInterval(interval);
  }, [isInitializing, showSplash, showOnboarding]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
    navigate('/', { replace: true });
  };

  if (isInitializing) return null;

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
      <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="category" element={<Shop />} />
            <Route path="contact" element={<Contact />} />
            <Route path="me" element={<Me />} />
            <Route path="cart" element={<Cart />} />
          </Route>
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>

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
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
