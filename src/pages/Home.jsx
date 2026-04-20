import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shirt, Diamond, Footprints, ScanFace, Combine, MoveHorizontal, ShoppingBag } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState('For You');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const activeCategory = searchParams.get('category');

  // Minimalist SVGs mapped conceptually to the categories
  const circleCategories = [
    { name: 'Women', icon: Shirt },
    { name: 'Curve', icon: Combine },
    { name: 'Kids', icon: ScanFace },
    { name: 'Men', icon: MoveHorizontal },
    { name: 'Shoes', icon: Footprints },
    { name: 'Occasion Bags', icon: ShoppingBag },
  ];

  const filterTabs = ['For You', '✨ New In', '🏷️ Deals', '🏆 Bestsellers'];

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

      {/* Hero Banner Slider Replacement - Luxury LUNA Execution */}
      <div className="px-3 md:px-4 py-3">
         <div className="w-full h-[160px] rounded-lg overflow-hidden relative shadow-lg bg-[#0a0a0a] border border-gold/20 flex flex-col items-center justify-center border-b-4 border-b-gold">
            {/* Faint subtle background texture trick */}
            <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]"></div>
            
            <h2 className="relative z-10 text-white font-display text-4xl uppercase tracking-[0.2em] font-black text-center mb-1">
               LUNA <span className="text-gold">FASHION</span>
            </h2>
            <span className="relative z-10 bg-white/10 text-gold text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-[0.25em] backdrop-blur-sm mt-2 border border-gold/30">
               Official Showcase
            </span>
         </div>
      </div>

      {/* Dynamic Filter Tabs - Sticky Header Offset */}
      <div className="sticky top-[108px] z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md flex justify-between items-center px-4 py-3 border-b border-gray-100 dark:border-gray-900 overflow-x-auto scrollbar-hide space-x-3" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         {filterTabs.map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 px-5 py-2 text-[11px] font-bold rounded-full transition-colors tracking-widest uppercase ${activeFilter === tab ? 'bg-black text-white dark:bg-gold dark:text-black shadow-md' : 'bg-[#f5f5f5] text-gray-500 dark:bg-[#1a1a1a] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
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
