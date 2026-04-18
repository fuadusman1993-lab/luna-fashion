import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';
import BottomNavBar from './BottomNavBar';
import InstallBanner from '../pwa/InstallBanner';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black transition-colors duration-300 sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-200 sm:dark:border-gray-800 relative shadow-2xl">
      <TopBar />

      <main className="flex-grow pt-[110px] pb-[80px] overflow-x-hidden bg-white dark:bg-black">
        <Outlet />
      </main>

      <InstallBanner />
      <BottomNavBar />
    </div>
  );
}
