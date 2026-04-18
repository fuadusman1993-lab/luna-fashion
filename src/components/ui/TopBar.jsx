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

         {/* Center Search Input */}
         <div className="flex-1 flex items-center bg-[#f5f5f5] dark:bg-[#1a1a1a] rounded-full mx-2 px-4 py-2 transition-colors border border-transparent dark:border-gray-800 focus-within:border-gold dark:focus-within:border-gold">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input 
               type="text" 
               placeholder="Luxury dresses..." 
               className="bg-transparent border-none outline-none flex-1 text-sm text-black dark:text-white"
            />
            <button className="text-gray-400 hover:text-gold transition-colors">
               <Camera className="w-5 h-5" />
            </button>
         </div>

         {/* Favorites Right */}
         <button className="text-luna-black dark:text-luna-white p-2">
            <Heart className="w-6 h-6" />
         </button>
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
