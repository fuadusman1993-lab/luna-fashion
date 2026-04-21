import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';
import { useAppContext } from '../../context/AppContext';
import { ShoppingBag } from 'lucide-react';

export default function Layout() {
  const { toastMessage } = useAppContext();
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#0a0a0a] transition-colors duration-300 max-w-[430px] mx-auto border-x border-gray-200 dark:border-gray-800 relative shadow-2xl">
      <TopBar />

      <main className="flex-grow pt-[140px] pb-[80px] overflow-x-hidden bg-white dark:bg-[#0a0a0a]">
        <Outlet />
      </main>

      <InstallBanner />
      <BottomNavBar />

      {/* Global Toast Notification Overlay */}
      {toastMessage && (
        <div className="fixed top-[150px] left-1/2 -translate-x-1/2 z-[100] bg-[#111111] text-white px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center space-x-3 transition-all animate-bounce border border-gold/30">
          <ShoppingBag className="w-[14px] h-[14px] text-gold" strokeWidth={2.5} />
          <span className="text-[12px] font-bold tracking-wider text-nowrap">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
