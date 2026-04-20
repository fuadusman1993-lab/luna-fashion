import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Scissors, Shirt, Component, Combine, Sparkles, Footprints } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeCategory = searchParams.get('category');

  // Minimalist SVGs mapped conceptually to the exact inventory categories
  const circleCategories = [
    { name: 'Makhawar (ቶብ)', icon: Scissors },
    { name: 'Abaya', icon: Shirt },
    { name: 'Dria', icon: Component },
    { name: 'Dresses (ቀሚስ)', icon: Combine },
    { name: 'Makeup', icon: Sparkles },
    { name: 'Shoes', icon: Footprints },
  ];

  const filterTabs = ['For You', 'New In', 'Deals', 'Best'];

  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a] min-h-[90vh]">
      
      {/* Circle Categories Horizontal Scroller (Line Icons Edition) */}
      <div className="overflow-x-auto whitespace-nowrap px-2 py-4 border-b border-gray-100 dark:border-gray-900 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex space-x-5 px-3 items-center">
            {circleCategories.map((cat, idx) => {
               const Icon = cat.icon;
               return (
               <div 
                 key={idx} 
                 onClick={() => navigate(`/?category=${encodeURIComponent(cat.name)}`)}
                 className="flex flex-col items-center cursor-pointer group"
               >
                  <div className={`w-[50px] h-[50px] rounded-full flex flex-col items-center justify-center border transition-all duration-300 mb-2 shadow-sm ${activeCategory === cat.name ? 'border-black dark:border-gold bg-black text-white dark:bg-gold dark:text-black scale-105' : 'border-gray-200 dark:border-gray-800 bg-[#fafafa] dark:bg-[#111111] text-gray-800 dark:text-gray-300 group-hover:border-gold'}`}>
                     <Icon className="w-[20px] h-[20px]" strokeWidth={1} />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${activeCategory === cat.name ? 'text-black dark:text-gold' : 'text-gray-500 dark:text-gray-400'}`}>{cat.name}</span>
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
         {filterTabs.map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 px-4 py-1.5 text-[12px] rounded-full transition-colors tracking-wide ${activeFilter === tab ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-bold shadow-md' : 'bg-[#f5f5f5] text-gray-700 dark:bg-[#1a1a1a] dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            >
              {tab}
            </button>
         ))}
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
