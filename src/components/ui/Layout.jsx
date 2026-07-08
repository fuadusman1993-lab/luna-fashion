import { useState } from 'react';
import { useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React from 'react';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const isHome = location.pathname === '/';

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 75;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      if (location.pathname === '/') navigate('/shop');
      else if (location.pathname === '/shop') navigate('/cart');
      else if (location.pathname === '/cart') navigate('/me');
    }
    if (isRightSwipe) {
      if (location.pathname === '/me') navigate('/cart');
      else if (location.pathname === '/cart') navigate('/shop');
      else if (location.pathname === '/shop') navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#0a0a0a] transition-colors duration-300 max-w-7xl w-full mx-auto relative shadow-2xl">
      <div className={isHome ? 'block' : 'hidden md:block'}>
        <TopBar />
      </div>

      <main 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`flex-grow ${isHome ? 'pt-[110px] md:pt-0' : 'pt-0 md:pt-[82px]'} pb-[80px] md:pb-0 overflow-x-hidden bg-white dark:bg-[#0a0a0a]`}
      >
        <AnimatePresence mode="wait">
          {outlet && React.cloneElement(outlet, { key: location.pathname })}
        </AnimatePresence>
      </main>

      <Footer />


      <InstallBanner />
      <BottomNavBar />
    </div>
  );
}
