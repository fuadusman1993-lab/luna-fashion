import { Search, Heart, Mail, Calendar, Camera, Mic } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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
     if (cat === 'All') {
        navigate('/');
     } else {
        navigate(`/?category=${encodeURIComponent(cat)}`);
     }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#000000]/80 backdrop-blur-lg transition-colors duration-300 shadow-sm sm:max-w-[480px] mx-auto pb-1 border-b border-white/10">
      {/* Hidden file input for camera/file upload mockup */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Sleek TikTok Banner */}
      <a 
        href="https://www.tiktok.com/@lunamarket2?_r=1&_t=ZS-95fxiBRtXYz" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex justify-center items-center w-full bg-[#d4af37] text-white dark:text-gray-900 py-[5px] text-center text-[10px] font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-[14px] h-[14px] mr-2">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
        </svg>
        Watch LUNA FASHION on TikTok
      </a>

      {/* Main Action/Search Row */}
      <div className="flex items-center justify-between px-3 pt-3 pb-3 gap-3">
         
         {/* Left Icons: Message & Calendar */}
         <div className="flex items-center gap-3 shrink-0 text-white">
            <button className="hover:opacity-70 transition-opacity"><Mail strokeWidth={1} className="w-[20px] h-[20px]" /></button>
            <button className="hover:opacity-70 transition-opacity"><Calendar strokeWidth={1} className="w-[20px] h-[20px]" /></button>
         </div>

         {/* Fully rounded, soft-gray background search bar */}
         <div className="flex-1 flex items-center bg-[#1f1f1f] rounded-full px-3 py-2 transition-colors border border-transparent focus-within:border-gold">
            <button className="shrink-0"><Search strokeWidth={1.5} className="w-4 h-4 text-gray-400 hover:text-gold" /></button>
            <input 
               type="text" 
               placeholder={placeholders[placeholderIdx]} 
               className="bg-transparent border-none outline-none flex-1 text-[11px] font-light tracking-wide text-white px-2 w-full placeholder-opacity-100 placeholder:transition-opacity duration-500"
            />
            <button className="text-gray-400 hover:text-gold transition-colors shrink-0 mr-2">
               <Mic strokeWidth={1.5} className="w-[16px] h-[16px]" />
            </button>
            <button onClick={handleCameraClick} className="text-gray-400 hover:text-gold transition-colors shrink-0 border-l border-white/10 pl-2">
               <Camera strokeWidth={1.5} className="w-[18px] h-[18px]" />
            </button>
         </div>

         {/* Right Icons: Heart */}
         <div className="flex items-center shrink-0 text-white">
             <button className="hover:opacity-70 transition-opacity"><Heart strokeWidth={1} className="w-[20px] h-[20px]" /></button>
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
