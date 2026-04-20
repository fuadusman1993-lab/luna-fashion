import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0a0a] transition-colors duration-300 sm:max-w-[480px] sm:mx-auto sm:border-x sm:border-gray-200 sm:dark:border-gray-800 relative shadow-2xl">
      <TopBar />

      <main className="flex-grow pt-[140px] pb-[80px] overflow-x-hidden bg-white dark:bg-[#0a0a0a]">
        <Outlet />
      </main>

      <InstallBanner />
      <BottomNavBar />
    </div>
  );
}
