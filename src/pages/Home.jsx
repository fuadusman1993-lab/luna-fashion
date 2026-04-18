import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { ChevronRight } from 'lucide-react';

export default function Home() {
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState('For You');

  const circleCategories = [
    { name: 'Women', img: 'https://images.unsplash.com/photo-1550614000-4b95d4edec75?q=80&w=200&fit=crop' },
    { name: 'Curve', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200&fit=crop' },
    { name: 'Kids', img: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=200&fit=crop' },
    { name: 'Men', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=200&fit=crop' },
    { name: 'Shoes', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200&fit=crop' },
    { name: 'Tops', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=200&fit=crop' },
  ];

  const filterTabs = ['For You', '✨ New In', '🏷️ Deals', '🏆 Bestsellers'];

  return (
    <div className="flex flex-col bg-white dark:bg-[#0a0a0a] min-h-[90vh]">
      
      {/* Circle Categories Horizontal Scroller */}
      <div className="overflow-x-auto whitespace-nowrap px-2 py-4 border-b border-gray-100 dark:border-gray-900 scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex space-x-4 px-2 items-center">
            {circleCategories.map((cat, idx) => (
               <div key={idx} className="flex flex-col items-center cursor-pointer">
                  <div className="w-[58px] h-[58px] rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 mb-1.5 shadow-sm">
                     <img src={cat.img} alt={cat.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">{cat.name}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Hero Banner Slider Replacement (Small) */}
      <div className="px-3 md:px-4 py-3">
         <div className="w-full h-[160px] rounded-lg overflow-hidden relative shadow-sm border border-gray-100 dark:border-gray-800">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover object-top" alt="Banner" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-6">
               <span className="bg-gold text-black text-[9px] font-bold px-2 py-0.5 rounded-sm w-max mb-1.5 uppercase tracking-wider shadow-sm">Free Shipping</span>
               <h2 className="text-white font-display text-xl font-bold leading-tight mb-2 tracking-wide">Buy 200 ETB<br/>more to get</h2>
               <button className="flex items-center text-[10px] font-bold text-white uppercase tracking-widest opacity-90 border-b border-white w-max pb-0.5">
                 View More <ChevronRight className="w-3 h-3 ml-1" />
               </button>
            </div>
         </div>
      </div>

      {/* Dynamic Filter Tabs - Sticky Header Offset */}
      <div className="sticky top-[108px] z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md flex justify-between items-center px-3 py-3 border-b border-gray-100 dark:border-gray-900 overflow-x-auto scrollbar-hide space-x-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         {filterTabs.map((tab, idx) => (
            <button 
              key={idx}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 px-4 py-1.5 text-[11px] font-bold rounded-full transition-colors tracking-wide ${activeFilter === tab ? 'bg-black text-white dark:bg-gold dark:text-black' : 'bg-[#f5f5f5] text-gray-600 dark:bg-[#1a1a1a] dark:text-gray-400'}`}
            >
              {tab}
            </button>
         ))}
      </div>

      {/* Flash Sale Header */}
      <div className="px-4 py-3 pb-2 flex justify-between items-center">
         <div className="flex items-center space-x-2">
            <h3 className="text-[13px] font-bold text-black dark:text-gold uppercase tracking-wider">Flash Sale</h3>
            <div className="flex space-x-1">
               <span className="bg-black text-white dark:bg-gray-800 text-[9px] px-1.5 py-0.5 rounded-sm font-mono font-bold">12</span>:
               <span className="bg-black text-white dark:bg-gray-800 text-[9px] px-1.5 py-0.5 rounded-sm font-mono font-bold">45</span>:
               <span className="bg-black text-white dark:bg-gray-800 text-[9px] px-1.5 py-0.5 rounded-sm font-mono font-bold">09</span>
            </div>
         </div>
      </div>

      {/* Masonry Product Grid */}
      <div className="pb-6 pt-1 h-full flex-1 bg-[#f9f9f9] dark:bg-[#0a0a0a]">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
           </div>
        ) : (
           <ProductGrid products={products} />
        )}
      </div>

    </div>
  );
}
