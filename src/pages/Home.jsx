import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductGrid from '../components/product/ProductGrid';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Flame, Star } from 'lucide-react';

const CustomIcons = {
  Abaya: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M8 4h8l3 7-2 1-2-5v13H7V7L5 12l-2-1 3-7Z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 4v17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Makhawar: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M7 4h10l2 6-1.5 11h-11L5 10l2-6Z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 4v17M14 4v17" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dria: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M9 4h6l2 5v12H7V9l2-5Z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 9v12" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Dresses: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M8 4h8l1 5-2 3 3 9H6l3-9-2-3 1-5Z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Shoes: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M4 18c0-1.5 1-3 3-3h1l3.5-5 3.5-5a2 2 0 0 1 2 0l1 1c1.5 1.5 2 3 2 6 0 1.5-1.5 2-3 2h-6l-3.5 3H7c-1.5 0-3-1-3-3z" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 18v3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  Makeup: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="8" y="12" width="8" height="9" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 12V7l2-4 2 4v5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="16" x2="16" y2="16" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  VerticalTag: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M8 3h8v15l-4-3-4 3V3Z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="7" r="1.5" fill="none"/>
    </svg>
  )
};export default function Home() {
  const { products, loading, error, retryFetch } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeCategory = searchParams.get('category');

  const filterTabs = [
    { name: 'For You', icon: null },
    { name: 'New In', icon: Flame },
    { name: 'Deals', icon: CustomIcons.VerticalTag },
    { name: 'Best', icon: Star }
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a] min-h-[90vh]">
      
      {/* Circle Categories Horizontal Scroller (Line Icons Edition) */}
      <div className="overflow-x-auto whitespace-nowrap px-1 py-4 border-b border-gray-100 dark:border-gray-900 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex space-x-4 px-2 items-center">
            {categories.map((cat, idx) => {
               // We map dynamic database categories
               const cleanName = cat.name.split('(')[0].trim();
               const isActive = activeCategory === cat.name;
               return (
               <div 
                 key={cat.id || idx} 
                 onClick={() => navigate(`/?category=${encodeURIComponent(cat.name)}`)}
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

      {/* Premium Full-Width Showcase Banner with Rounded Corners */}
      <div className="w-[calc(100%-16px)] mx-auto h-[160px] relative flex flex-col items-center justify-center rounded-xl overflow-hidden mb-3 shadow-md mt-1">
         {/* Background Image */}
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
         {/* Deep Layering Overlay for Contrast */}
         <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
         
         <h2 className="relative z-10 text-white font-display text-[2.2rem] leading-none uppercase tracking-[0.2em] font-black text-center mb-1 drop-shadow-lg">
            LUNA <span className="text-[#D4AF37]">FASHION</span>
         </h2>
         <span className="relative z-10 bg-white/20 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest backdrop-blur-md mt-1 border border-white/40 shadow-sm select-none">
            Official Showcase
         </span>
      </div>

      {/* Dynamic Filter Tabs - Clean AliExpress Style */}
      <div className="sticky top-[90px] z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md flex justify-start items-center px-4 py-2 border-b-0 overflow-x-auto scrollbar-hide space-x-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         {filterTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isSelected = activeFilter === tab.name;
            return (
            <button 
              key={idx}
              onClick={() => setActiveFilter(tab.name)}
              className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-1.5 text-[12px] rounded-full transition-colors tracking-wide border ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-black dark:border-white shadow-md' : 'bg-[#f8f8f8] text-gray-700 dark:bg-[#111111] dark:text-gray-300 font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}
            >
              {Icon && <Icon className="w-[14px] h-[14px]" strokeWidth={isSelected ? 2 : 1.5} />}
              <span className={!Icon ? 'px-1' : ''}>{tab.name}</span>
            </button>
         )})}
      </div>

      {/* Masonry Product Grid */}
      <div className="pb-6 pt-3 h-full flex-1 bg-white dark:bg-[#0a0a0a]">
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
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
           </div>
        ) : (
           <ProductGrid products={
             (products || []).filter(p => {
               if (activeCategory && p.category !== activeCategory) return false;
               if (activeFilter === 'New In' && !p.isNewIn) return false;
               if (activeFilter === 'Deals' && !p.isDeal) return false;
               if (activeFilter === 'Best' && !p.isBestseller) return false;
               return true;
             })
           } />
        )}
      </div>

    </div>
  );
}
