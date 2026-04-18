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
    <div className="bg-luna-white dark:bg-luna-black transition-colors duration-300 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display text-luna-black dark:text-luna-white uppercase tracking-widest mb-4">{t('theCollection')}</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          <p className="text-gray-500 dark:text-gray-400 font-light max-w-2xl mx-auto">
            {t('collectionDesc')}
          </p>
        </motion.div>
        
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
           </div>
        ) : (
           <ProductGrid products={activeCategory ? products.filter(p => p.category === activeCategory) : products} />
        )}
      </div>
    </div>
  );
}
