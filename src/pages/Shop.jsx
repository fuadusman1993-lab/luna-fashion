import { useState, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { useAppContext } from '../context/AppContext';

export default function Shop() {
  const { products, loading, error, retryFetch } = useProducts();
  const { t } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Makhawar (ቶብ)', 'Abaya', 'Dria', 'Dresses (ቀሚስ)', 'Makeup', 'Shoes'];

  const filteredProducts = useMemo(() => {
    const safeProducts = products || [];
    if (activeCategory === 'All') return safeProducts;
    return safeProducts.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="bg-[#f5f5f5] dark:bg-[#050505] min-h-[calc(100vh-140px)] font-sans flex flex-col md:flex-row w-full mx-auto relative z-0">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-[220px] shrink-0 bg-[#f5f5f5] dark:bg-[#050505] overflow-x-auto md:overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 flex md:flex-col pb-2 md:pb-10 pt-2 md:pt-6 px-2" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         {categories.map(category => (
            <button
               key={category}
               onClick={() => setActiveCategory(category)}
               className={`shrink-0 md:w-full text-center md:text-left px-4 py-2 md:py-4 text-[12px] md:text-[13px] font-medium leading-tight transition-colors flex items-center justify-center md:justify-start min-h-[40px] md:min-h-[60px] mr-2 md:mr-0 rounded-full md:rounded-none border md:border-0 md:border-l-[3px] ${
                  activeCategory === category 
                  ? 'bg-white dark:bg-[#111111] text-black dark:text-white border-transparent md:border-[#D4AF37] shadow-sm font-bold md:bg-white md:dark:bg-[#111111]' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 border-gray-200 dark:border-gray-800 md:border-transparent bg-transparent'
               }`}
            >
               {category.split(' ')[0]}
            </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white dark:bg-[#111111] overflow-y-auto px-2 md:px-6 pt-4 pb-[100px] no-scrollbar" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         <div className="flex justify-between items-center mb-4 px-2">
             <h2 className="text-[13px] font-bold text-black dark:text-white uppercase tracking-wide">
                {activeCategory === 'All' ? t('theCollection') || 'All Items' : activeCategory}
             </h2>
             <span className="text-[10px] text-gray-400 font-medium">{filteredProducts.length} items</span>
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
