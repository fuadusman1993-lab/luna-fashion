import { Search, Heart, MessageSquare, Camera, ShoppingCart, ArrowLeft, History, TrendingUp, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

export default function TopBar() {
  const { toggleTheme, theme, t, cart } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      setIsSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      setIsSearchOpen(false);
      navigate(`/search`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearchClick();
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#000000]/90 backdrop-blur-md transition-colors duration-300 shadow-sm max-w-7xl mx-auto pb-0 border-b border-white/10">
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
      <div className="flex items-center justify-between px-3 pt-3 pb-2 gap-3 md:gap-6 md:px-6">

        {/* Left Icon: Message & Desktop Logo */}
        <div className="flex items-center shrink-0 text-white">
          <Link to="/messages" className="hover:opacity-70 transition-opacity p-1 md:hidden">
            <MessageSquare strokeWidth={1.25} className="w-[22px] h-[22px]" />
          </Link>
          <Link to="/" className="hidden md:block font-display text-[22px] font-bold tracking-widest text-[#D4AF37] whitespace-nowrap px-2 hover:opacity-80 transition-opacity">
            LUNA
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex shrink-0 items-center gap-8 text-[13px] font-bold tracking-widest text-gray-300">
          <Link to="/" className="hover:text-white transition-colors uppercase">Home</Link>
          <Link to="/shop" className="hover:text-white transition-colors uppercase">Shop</Link>
          <Link to="/cart" className="hover:text-white transition-colors uppercase">Cart</Link>
          <Link to="/me" className="hover:text-white transition-colors uppercase">Profile</Link>
        </div>

        {/* Fully rounded, highly focused search bar */}
        <div 
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 md:flex-none md:w-[350px] flex items-center bg-white rounded-full px-3 py-1.5 shadow-inner transition-colors cursor-text"
        >
          <Search strokeWidth={1.25} className="w-[16px] h-[16px] text-gray-400 mr-2 shrink-0" />
          <div className="flex-1 text-[13px] font-medium tracking-wide text-gray-400 w-full overflow-hidden whitespace-nowrap text-ellipsis px-1">
             {placeholders[placeholderIdx]}
          </div>
          <button onClick={(e) => { e.stopPropagation(); handleCameraClick(); }} className="text-gray-400 hover:text-black transition-colors ml-2 shrink-0 pl-2 border-l border-gray-300 pointer-events-auto">
            <Camera strokeWidth={1.25} className="w-[18px] h-[18px]" />
          </button>
        </div>

        {/* Right Icons: Heart & Cart */}
        <div className="flex items-center shrink-0 text-white gap-2">
          <Link to="/me" className="hover:opacity-70 transition-opacity p-1">
            <Heart strokeWidth={1.25} className="w-[22px] h-[22px]" />
          </Link>
          <Link to="/cart" className="hover:opacity-70 transition-opacity p-1 relative">
            <ShoppingCart strokeWidth={1.25} className="w-[22px] h-[22px]" />
            {cart && cart.length > 0 && (
               <span className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-black shadow">
                  {cart.length}
               </span>
            )}
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
            )
          })}
        </div>
      </div>

      {/* Professional Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 top-0 z-[100] bg-white dark:bg-[#0a0a0a] w-full h-[100dvh] max-w-7xl mx-auto flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center px-3 py-3 border-b border-gray-100 dark:border-white/10 gap-2 bg-white dark:bg-[#0a0a0a]">
            <button onClick={() => setIsSearchOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-full transition-colors shrink-0">
              <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
            <div className="flex-1 flex items-center bg-gray-100 dark:bg-[#1a1a1a] rounded-full px-3 py-2 transition-colors border border-gray-200 dark:border-gray-800">
              <Search strokeWidth={1.5} className="w-[16px] h-[16px] text-gray-400 mr-2 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search..."
                className="bg-transparent border-none outline-none flex-1 text-[13px] font-medium text-gray-800 dark:text-white placeholder-gray-400 w-full"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button onClick={handleCameraClick} className="text-gray-400 hover:text-black dark:hover:text-white transition-colors ml-2 shrink-0 pl-2 border-l border-gray-300 dark:border-gray-700">
                <Camera strokeWidth={1.5} className="w-[18px] h-[18px]" />
              </button>
            </div>
            <button onClick={handleSearchClick} className="text-[13px] font-bold px-2 text-black dark:text-white shrink-0">
              Search
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-8 bg-white dark:bg-[#0a0a0a]">
            {/* Recent Searches */}
            <div>
              <div className="flex items-center justify-between mb-3 text-gray-900 dark:text-white font-bold text-[14px]">
                <div className="flex items-center gap-1.5">
                  <History className="w-[16px] h-[16px]" strokeWidth={2} />
                  Recent Searches
                </div>
                <button className="text-[11px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 font-medium">Clear</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Abaya Luxury', 'Summer Dress', 'Heels'].map((term, i) => (
                  <span key={i} onClick={() => { setSearchQuery(term); handleSearchClick(); }} className="px-3.5 py-1.5 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-white/5 text-[12px] font-medium text-gray-700 dark:text-gray-300 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Trending Searches */}
            <div>
              <div className="flex items-center mb-3 text-red-600 dark:text-red-500 font-bold text-[14px] gap-1.5">
                <TrendingUp className="w-[16px] h-[16px]" strokeWidth={2} />
                Trending on LUNA
              </div>
              <div className="flex flex-wrap gap-2">
                {['Gold Makhawar', 'Crystal Heels', 'Satin Dria', 'Matte Lipstick', 'Dubai Abaya Open'].map((term, i) => (
                  <span key={i} onClick={() => { setSearchQuery(term); handleSearchClick(); }} className="px-3.5 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[12px] font-bold rounded-full border border-red-100 dark:border-red-900/30 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
