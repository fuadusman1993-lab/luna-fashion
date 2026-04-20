import { Search, Heart, Mail, Camera, ShoppingCart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function TopBar() {
  const { toggleTheme, theme, t } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const topCategories = [t('allNav'), 'Makhawar (ቶብ)', 'Abaya', 'Dria', 'Dresses (ቀሚስ)', 'Makeup', 'Shoes'];

  const placeholders = ['Search Occasion Bags...', 'Search LUNA Specials...', 'Search Signature Coats...', 'Search Trending Styles...'];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      alert(`Initializing visual search for: ${file.name}`);
    }
  };

  const handleCategoryClick = (cat) => {
     if (cat === t('allNav')) {
        navigate('/');
     } else {
        navigate(`/?category=${encodeURIComponent(cat)}`);
     }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/search`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#000000]/90 backdrop-blur-md transition-colors duration-300 shadow-sm sm:max-w-[480px] mx-auto pb-0 border-b border-white/10">
      {/* Hidden file input for camera/file upload mockup */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Main Action/Search Row */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-3">
         
         {/* Left Icon: Message */}
         <div className="flex items-center shrink-0 text-white">
            <Link to="/messages" className="hover:opacity-70 transition-opacity p-1">
              <Mail strokeWidth={1.5} className="w-[22px] h-[22px]" />
            </Link>
         </div>

         {/* Fully rounded, highly focused search bar */}
         <div className="flex-1 flex items-center bg-white rounded-full px-3 py-1.5 shadow-inner transition-colors">
            <Search strokeWidth={2} className="w-[16px] h-[16px] text-gray-400 mr-2 shrink-0" />
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder="Search Trending Styles..." 
               className="bg-transparent border-none outline-none flex-1 text-[13px] font-medium tracking-wide text-gray-800 placeholder-gray-400 w-full"
            />
            <button onClick={handleCameraClick} className="text-gray-400 hover:text-black transition-colors ml-2 shrink-0 pl-2 border-l border-gray-300">
               <Camera strokeWidth={1.5} className="w-[18px] h-[18px]" />
            </button>
         </div>

         {/* Right Icons: Heart & Cart */}
         <div className="flex items-center shrink-0 text-white gap-2">
             <Link to="/me" className="hover:opacity-70 transition-opacity p-1">
               <Heart strokeWidth={1.5} className="w-[22px] h-[22px]" />
             </Link>
             <Link to="/cart" className="hover:opacity-70 transition-opacity p-1 relative">
               <ShoppingCart strokeWidth={1.5} className="w-[22px] h-[22px]" />
               <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black shadow">3</span>
             </Link>
         </div>
      </div>

      {/* Scroller Row (Tabs) */}
      <div className="overflow-x-auto whitespace-nowrap px-3 scrollbar-hide mt-1" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex space-x-6 items-center">
            {topCategories.map((cat, idx) => {
              const isActive = cat === activeCategory;
              return (
              <button 
                key={idx}
                onClick={() => handleCategoryClick(cat)}
                className={`text-[14px] pb-2 px-1 relative transition-colors ${isActive ? 'text-white font-bold' : 'text-gray-400 font-medium hover:text-gray-300'}`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-full"></span>
                )}
              </button>
            )})}
         </div>
      </div>
    </header>
  );
}
