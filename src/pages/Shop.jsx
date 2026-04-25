import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductGrid from '../components/product/ProductGrid';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';

export default function Shop() {
  const { products, loading, error, retryFetch } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { cart } = useAppContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
     setActiveCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  const handleCategoryClick = (catName) => {
     setActiveCategory(catName);
     if (catName === 'All') {
        setSearchParams({});
     } else {
        setSearchParams({ category: catName });
     }
  };

  const filteredProducts = useMemo(() => {
    const safeProducts = products || [];
    if (activeCategory === 'All') return safeProducts;
    return safeProducts.filter(p => p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
  }, [products, activeCategory]);

  return (
    <div className="bg-[#f5f5f5] dark:bg-[#050505] min-h-[calc(100vh-80px)] font-sans flex flex-col w-full mx-auto relative z-0">
      
      {/* Custom Shop Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-gray-900 sticky top-0 z-50">
        {/* Left: Back Button */}
        <button onClick={() => navigate(-1)} className="hidden md:block text-black dark:text-white shrink-0">
           <ArrowLeft className="w-[22px] h-[22px]" strokeWidth={1.5} />
        </button>
        
        {/* Center: Title */}
        <h1 className="text-[15px] font-display tracking-widest uppercase font-bold text-black dark:text-white absolute left-1/2 -translate-x-1/2">
           SHOP
        </h1>
        
        {/* Right: Search & Cart */}
        <div className="flex items-center gap-4 text-black dark:text-white shrink-0 ml-auto">
          <button onClick={() => navigate('/search')}><Search className="w-[20px] h-[20px]" strokeWidth={1.5} /></button>
          <button onClick={() => navigate('/cart')} className="relative">
             <ShoppingCart className="w-[20px] h-[20px]" strokeWidth={1.5} />
             {cart && cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-black shadow-sm">
                   {cart.length}
                </span>
             )}
          </button>
        </div>
      </div>

      {/* Dynamic Category Navigation */}
      <div className="overflow-x-auto whitespace-nowrap px-1 py-4 border-b border-gray-100 dark:border-gray-900 scrollbar-hide bg-white dark:bg-[#111111] shrink-0 [&::-webkit-scrollbar]:hidden" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
         <div className="flex space-x-4 px-2 items-center">
            {/* All Category Circle */}
            <div 
              onClick={() => handleCategoryClick('All')}
              className="flex flex-col items-center cursor-pointer group flex-shrink-0"
            >
               <div className={`w-[54px] h-[54px] rounded-full flex flex-col items-center justify-center border transition-all duration-300 mb-1.5 shadow-sm overflow-hidden ${activeCategory === 'All' ? 'border-gold scale-105 shadow-[0_0_15px_rgba(212,175,55,0.6)] ring-2 ring-gold/50' : 'border-gray-200 dark:border-gray-800 bg-[#f8f8f8] dark:bg-[#111111] hover:shadow-md'}`}>
                  <span className={`font-bold text-lg uppercase ${activeCategory === 'All' ? 'text-gold' : 'text-gray-400 dark:text-gray-500'}`}>ALL</span>
               </div>
               <span className={`text-[11px] font-sans tracking-wide transition-colors ${activeCategory === 'All' ? 'text-gold font-bold drop-shadow-sm' : 'text-green-600 dark:text-green-500 font-medium'}`}>All</span>
            </div>

            {categories.map((cat, idx) => {
               const cleanName = cat.name.split('(')[0].trim();
               const isActive = activeCategory === cat.name;
               return (
               <div 
                 key={cat.id || idx} 
                 onClick={() => handleCategoryClick(cat.name)}
                 className="flex flex-col items-center cursor-pointer group flex-shrink-0"
               >
                  <div className={`w-[54px] h-[54px] rounded-full flex flex-col items-center justify-center border transition-all duration-300 mb-1.5 shadow-sm overflow-hidden ${isActive ? 'border-gold scale-105 shadow-[0_0_15px_rgba(212,175,55,0.6)] ring-2 ring-gold/50' : 'border-gray-200 dark:border-gray-800 bg-[#f8f8f8] dark:bg-[#111111] hover:shadow-md'}`}>
                     {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cleanName} className="w-full h-full object-cover" />
                     ) : (
                        <span className="font-bold text-gray-400 dark:text-gray-500 text-lg uppercase">{cleanName.charAt(0)}</span>
                     )}
                  </div>
                  <span className={`text-[11px] font-sans tracking-wide transition-colors ${isActive ? 'text-gold font-bold drop-shadow-sm' : 'text-green-600 dark:text-green-500 font-medium'}`}>{cleanName}</span>
               </div>
            )})}
            {categoriesLoading && categories.length === 0 && (
               [1, 2, 3, 4, 5].map((skeleton) => (
                  <div key={`sk-${skeleton}`} className="flex flex-col items-center flex-shrink-0 space-y-1.5">
                     <div className="w-[54px] h-[54px] rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                     <div className="w-12 h-3 rounded bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                  </div>
               ))
            )}
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#f5f5f5] dark:bg-[#050505] overflow-y-auto px-2 md:px-6 pt-4 pb-[100px] no-scrollbar [&::-webkit-scrollbar]:hidden" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
         <div className="flex justify-between items-center mb-4 px-2">
             <h2 className="text-[13px] font-bold text-black dark:text-white uppercase tracking-wide">
                {activeCategory === 'All' ? 'The Collection' : activeCategory.split('(')[0].trim()}
             </h2>
             <span className="text-[10px] text-green-600 dark:text-green-500 font-bold">{filteredProducts.length} items</span>
         </div>
         
         {error ? (
           <div className="flex flex-col items-center justify-center py-20 text-center px-4">
             <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <h2 className="text-lg font-bold text-black dark:text-white mb-2">No Connection</h2>
             <p className="text-[12px] text-gray-500 mb-6">We couldn't connect to the server. Please check your internet connection.</p>
             <button onClick={retryFetch} className="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider py-3 px-8 text-xs rounded-full shadow-md">Retry Now</button>
           </div>
         ) : loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold"></div>
           </div>
         ) : filteredProducts.length > 0 ? (
           <div className="-mx-1">
             <ProductGrid products={filteredProducts} />
           </div>
         ) : (
           <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <p className="text-gray-400 text-[11px]">No items found in this category.</p>
           </div>
         )}
      </div>
    </div>
  );
}
