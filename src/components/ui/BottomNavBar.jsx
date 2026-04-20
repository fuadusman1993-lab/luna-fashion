import { Home, ShoppingBag, ShoppingCart, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function BottomNavBar() {
  const { t } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/category', icon: ShoppingBag },
    { name: 'Cart', path: '/cart', icon: ShoppingCart },
    { name: 'Me', path: '/me', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-luna-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-900 z-50 flex justify-around items-center pt-2 pb-5 max-w-[430px] mx-auto border-x border-gray-200 dark:border-gray-800 px-2 pb-safe">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (location.pathname === '/shop' && item.path === '/category');
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center p-1 w-full transition-colors ${isActive ? 'text-luna-black dark:text-gold' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
          >
            <Icon className={`w-[22px] h-[22px] mb-1.5 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={1.25} />
            <span className="text-[10px] font-bold tracking-wide uppercase">{item.name}</span>
          </Link>
        )
      })}
    </nav>
  );
}
