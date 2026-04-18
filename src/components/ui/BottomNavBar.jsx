import { Home, Grid, Zap, ShoppingBag, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function BottomNavBar() {
  const { t } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: t('home') || 'Shop', path: '/', icon: Home },
    { name: 'Category', path: '/category', icon: Grid },
    { name: 'Trends', path: '/trends', icon: Zap },
    { name: t('cart') || 'Cart', path: '/cart', icon: ShoppingBag },
    { name: 'Me', path: '/me', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-luna-white dark:bg-luna-black border-t border-gray-200 dark:border-gray-800 z-50 flex justify-around items-center pt-2 pb-5 sm:max-w-md sm:mx-auto sm:relative px-2">
       {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/shop' && item.path === '/category'); // link safety
          const Icon = item.icon;
          return (
             <Link 
               key={item.name} 
               to={item.path} 
               className={`flex flex-col items-center justify-center p-1 min-w-[60px] transition-colors ${isActive ? 'text-luna-black dark:text-gold' : 'text-gray-500 dark:text-gray-400'}`}
             >
                <Icon className={`w-[22px] h-[22px] mb-1 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
             </Link>
          )
       })}
    </nav>
  );
}
