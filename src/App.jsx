import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(false);

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="category" element={<Shop />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
          <Route path="me" element={<Me />} />
          <Route path="cart" element={<Cart />} />
        </Route>
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppContent />
  );
}

export default App;
