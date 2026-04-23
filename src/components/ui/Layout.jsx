import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCart = location.pathname === '/cart';

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

    if (isLeftSwipe && location.pathname === '/') {
      navigate('/shop');
    }
    if (isRightSwipe && location.pathname === '/shop') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#0a0a0a] transition-colors duration-300 max-w-7xl w-full mx-auto relative shadow-2xl">
      {!isCart && <TopBar />}

      <main 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`flex-grow ${isCart ? 'pt-0' : 'pt-[110px]'} pb-[80px] overflow-x-hidden bg-white dark:bg-[#0a0a0a]`}
      >
        <Outlet />
      </main>

      <InstallBanner />
      <BottomNavBar />
    </div>
  );
}
