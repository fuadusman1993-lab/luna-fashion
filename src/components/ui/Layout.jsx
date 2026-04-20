import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f9] dark:bg-[#0a0a0a] transition-colors duration-300 max-w-[430px] mx-auto border-x border-gray-200 dark:border-gray-800 relative shadow-2xl">
      <TopBar />

      <main className="flex-grow pt-[140px] pb-[80px] overflow-x-hidden bg-white dark:bg-[#0a0a0a]">
        <Outlet />
      </main>

      <InstallBanner />
      <BottomNavBar />
    </div>
  );
}
