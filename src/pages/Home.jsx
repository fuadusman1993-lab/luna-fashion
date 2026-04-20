import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Scissors, Shirt, Component, Combine, Sparkles, Footprints, Heart, Flame, Tag, Star } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeCategory = searchParams.get('category');

  // Minimalist SVGs mapped conceptually to the exact inventory categories
  const circleCategories = [
    { name: 'Makhawar', icon: Scissors },
    { name: 'Abaya', icon: Shirt },
    { name: 'Dria', icon: Component },
    { name: 'Dresses', icon: Combine },
    { name: 'Shoes', icon: Footprints },
    { name: 'Makeup', icon: Sparkles },
  ];

  const filterTabs = [
    { name: 'For You', icon: Heart },
    { name: 'New In', icon: Flame },
    { name: 'Deals', icon: Tag },
    { name: 'Best', icon: Star }
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a] min-h-[90vh]">
      
      {/* Circle Categories Horizontal Scroller (Line Icons Edition) */}
      <div className="overflow-x-auto whitespace-nowrap px-1 py-4 border-b border-gray-100 dark:border-gray-900 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex space-x-4 px-2 items-center">
            {circleCategories.map((cat, idx) => {
               const Icon = cat.icon;
               return (
               <div 
                 key={idx} 
                 onClick={() => navigate(`/?category=${encodeURIComponent(cat.name)}`)}
                 className="flex flex-col items-center cursor-pointer group flex-shrink-0"
               >
                  <div className={`w-[54px] h-[54px] rounded-full flex flex-col items-center justify-center border transition-all duration-300 mb-1.5 shadow-sm ${activeCategory === cat.name ? 'border-black dark:border-gold bg-black text-white dark:bg-gold dark:text-black scale-105 shadow-md' : 'border-gray-200 dark:border-gray-800 bg-[#f8f8f8] dark:bg-[#111111] text-gray-800 dark:text-gray-300 hover:shadow-md'}`}>
                     <Icon className="w-[20px] h-[20px]" strokeWidth={1.25} />
                  </div>
                  <span className={`text-[11px] font-bold tracking-wide ${activeCategory === cat.name ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>{cat.name}</span>
               </div>
            )})}
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
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 text-[12px] rounded-full transition-colors tracking-wide border ${isSelected ? 'bg-black text-white dark:bg-white dark:text-black font-bold border-black dark:border-white shadow-md' : 'bg-[#f8f8f8] text-gray-700 dark:bg-[#111111] dark:text-gray-300 font-medium border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}
            >
              <Icon className="w-[14px] h-[14px]" strokeWidth={isSelected ? 2 : 1.5} />
              {tab.name}
            </button>
         )})}
      </div>

      {/* Masonry Product Grid */}
      <div className="pb-6 pt-3 h-full flex-1 bg-white dark:bg-[#0a0a0a]">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
           </div>
        ) : (
           <ProductGrid products={activeCategory ? products.filter(p => p.category === activeCategory) : products} />
        )}
      </div>

    </div>
  );
}
