import { Search, Heart, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TopBar() {
  const { toggleTheme, theme } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  
  const topCategories = ['All', 'Women', 'Shoes', 'Curve', 'Men', 'Kids', 'Occasion Bags'];

  const placeholders = ['Search Occasion Bags...', 'Search LUNA Specials...', 'Search Signature Coats...', 'Search Trending Styles...'];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (cat) => {
     if (cat === 'All') {
        navigate('/');
     } else {
        navigate(`/?category=${encodeURIComponent(cat)}`);
     }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-luna-white dark:bg-luna-black transition-colors duration-300 shadow-sm sm:max-w-[480px] mx-auto">
      {/* TikTok Banner */}
      <a 
        href="https://www.tiktok.com/@lunamarket2?_r=1&_t=ZS-95fxiBRtXYz" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block w-full bg-[#0a0a0a] text-gold dark:bg-gold dark:text-black py-1.5 text-center text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
      >
        Watch LUNA FASHION on TikTok
      </a>

      {/* Search Row */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
         {/* Theme toggler */}
         <button onClick={toggleTheme} className="text-luna-black dark:text-luna-white p-2">
            {theme === 'dark' ? <Sun strokeWidth={1} className="w-6 h-6" /> : <Moon strokeWidth={1} className="w-6 h-6" />}
         </button>

         {/* Center Brand Logo */}
         <div className="flex-1 flex justify-center items-center px-2">
             <h1 onClick={() => navigate('/')} className="font-display text-xl font-bold tracking-[0.2em] uppercase text-luna-black dark:text-white cursor-pointer select-none">
                LUNA
                <span className="text-gold.DEFAULT ml-1">FASHION</span>
             </h1>
         </div>

         {/* Right Icons */}
         <button className="text-luna-black dark:text-luna-white p-2">
             <Heart strokeWidth={1} className="w-6 h-6" />
         </button>
      </div>

      {/* Dynamic Search Bar Row */}
      <div className="px-3 pb-2">
         <div className="flex w-full items-center bg-[#f5f5f5] dark:bg-[#1a1a1a] rounded-full px-4 py-2 transition-colors border border-transparent dark:border-gray-800 focus-within:border-gold dark:focus-within:border-gold">
            <Search strokeWidth={1.5} className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
            <input 
               type="text" 
               placeholder={placeholders[placeholderIdx]} 
               className="bg-transparent border-none outline-none flex-1 text-sm text-black dark:text-white w-full placeholder-opacity-100 placeholder:transition-opacity duration-500"
            />
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
