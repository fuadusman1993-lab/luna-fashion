import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';

export default function Layout() {
  const location = useLocation();
  const isCart = location.pathname === '/cart';

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#0a0a0a] transition-colors duration-300 max-w-7xl w-full mx-auto relative shadow-2xl">
      {!isCart && <TopBar />}

      <main className={`flex-grow ${isCart ? 'pt-0' : 'pt-[140px]'} pb-[80px] overflow-x-hidden bg-white dark:bg-[#0a0a0a]`}>
        <Outlet />
      </main>

      <InstallBanner />
      <BottomNavBar />
    </div>
  );
}
