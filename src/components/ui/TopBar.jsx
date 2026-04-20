import { Search, Camera, Heart, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TopBar() {
  const { toggleTheme, theme } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  
  const topCategories = ['All', 'Women', 'Shoes', 'Curve', 'Men', 'Kids', 'Jewelry'];

  const handleCategoryClick = (cat) => {
     if (cat === 'All') {
        navigate('/');
     } else {
        navigate(`/?category=${encodeURIComponent(cat)}`);
     }
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-luna-white dark:bg-luna-black transition-colors duration-300 shadow-sm">
      {/* Search Row */}
      <div className="flex items-center justify-between px-3 pt-4 pb-2">
         {/* Theme toggler */}
         <button onClick={toggleTheme} className="text-luna-black dark:text-luna-white p-2">
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
         </button>

         {/* Center Brand Logo */}
         <div className="flex-1 flex justify-center items-center px-2">
             <h1 onClick={() => navigate('/')} className="font-display text-xl font-bold tracking-[0.2em] uppercase text-luna-black dark:text-white cursor-pointer select-none">
                LUNA
                <span className="text-gold.DEFAULT ml-1">FASHION</span>
             </h1>
         </div>

         {/* Right Icons */}
         <div className="flex items-center space-x-1">
            <button className="text-luna-black dark:text-luna-white p-2">
               <Search className="w-5 h-5" />
            </button>
            <button className="text-luna-black dark:text-luna-white p-2">
               <Heart className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Scroller Row */}
      <div className="overflow-x-auto whitespace-nowrap px-3 pb-1 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex space-x-6 items-center">
            {topCategories.map((cat, idx) => {
              const isActive = cat === activeCategory;
              return (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(cat)}
                className={`text-[15px] pb-2 border-b-2 transition-colors ${isActive ? 'text-luna-black dark:text-gold font-bold border-luna-black dark:border-gold' : 'text-gray-600 dark:text-gray-400 font-medium border-transparent hover:text-gold dark:hover:text-gold'}`}
              >
                {cat}
              </button>
            )})}
         </div>
      </div>
    </header>
  );
}
