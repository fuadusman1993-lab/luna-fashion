import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';

export default function Shop() {
  const { products, loading } = useProducts();
  const { t } = useAppContext();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  return (
    <div className="bg-[#f5f5f5] dark:bg-[#050505] transition-colors duration-300 min-h-screen pb-[100px] font-sans">
      
      {/* Shop Header Block - Matching Cart cleanly */}
      <div className="bg-white dark:bg-[#111111] border-b border-gray-100 dark:border-white/5 py-6 px-4 sm:px-6 lg:px-8 mb-4 shadow-sm">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold font-serif text-black dark:text-white uppercase tracking-widest mb-2">{t('theCollection')}</h1>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mb-3"></div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-md mx-auto px-4">
            {t('collectionDesc')}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pb-10">
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
