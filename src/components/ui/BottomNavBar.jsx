import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function BottomNavBar() {
  const { t } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: t('home') || 'Shop', path: '/', icon: Home },
    { name: 'Category', path: '/category', icon: Grid },
    { name: t('cart') || 'Cart', path: '/cart', icon: ShoppingBag },
    { name: 'Me', path: '/me', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-luna-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-900 z-50 flex justify-around items-center pt-2 pb-5 sm:max-w-md sm:mx-auto sm:relative px-2">
       {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname === '/shop' && item.path === '/category');
          const Icon = item.icon;
          return (
             <Link 
               key={item.name} 
               to={item.path} 
               className={`flex flex-col items-center justify-center p-1 w-full transition-colors ${isActive ? 'text-luna-black dark:text-gold' : 'text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400'}`}
             >
                <Icon className={`w-[22px] h-[22px] mb-1.5 ${isActive ? 'fill-current opacity-20' : ''}`} strokeWidth={1.2} />
                <span className="text-[10px] font-bold tracking-wide uppercase">{item.name}</span>
             </Link>
          )
       })}
    </nav>
  );
}
