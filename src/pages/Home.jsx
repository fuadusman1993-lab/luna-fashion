import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { useAppContext } from '../context/AppContext';

export default function Home() {
  const { products, loading } = useProducts();
  const newArrivals = products.slice(0, 4);
  const { t } = useAppContext();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] bg-luna-black dark:bg-black flex items-center overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Fashion" 
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-luna-black dark:from-black via-luna-black/50 dark:via-black/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-medium text-luna-white mb-6 uppercase tracking-widest leading-tight"
          >
            {t('redefine')} <br/>
            <span className="text-gradient-gold italic normal-case">{t('elegance')}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-300 max-w-2xl mx-auto mb-10 font-light"
          >
            {t('heroDesc')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link 
              to="/shop" 
              className="inline-block bg-transparent border border-gold text-gold hover:bg-gold hover:text-black py-4 px-10 uppercase tracking-widest text-sm font-semibold transition-all duration-300"
            >
              {t('shop')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-24 bg-luna-white dark:bg-luna-black transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display uppercase tracking-widest mb-4 text-luna-black dark:text-luna-white">{t('newArrivals')}</h2>
            <div className="w-16 h-0.5 bg-gold mx-auto"></div>
          </div>
          <ProductGrid products={newArrivals} />
          <div className="mt-16 text-center">
            <Link 
              to="/shop" 
              className="inline-block border-b border-luna-black dark:border-gold pb-1 hover:text-gold text-luna-black dark:text-gold transition-colors font-medium uppercase tracking-wider text-sm"
            >
              {t('viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* TikTok Highlight Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display uppercase tracking-widest mb-4 text-luna-black dark:text-luna-white">{t('lunaInMotion')}</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light max-w-lg mx-auto">{t('lunaInMotionDesc')}</p>
          </div>
          
          <div className="flex justify-center">
             {/* Note: This is an aesthetic placeholder for actual TikTok embed script */}
            <div className="w-full max-w-[325px] h-[550px] bg-black rounded-lg relative overflow-hidden shadow-2xl flex items-center justify-center border border-gray-800">
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 flex flex-col justify-end p-6">
                 <p className="text-white font-semibold mb-1">@lunafashion.et</p>
                 <p className="text-gray-300 text-sm mb-4">Our stunning new arrival. Perfectly tailored. ✨ #LunaFashion #AddisAbaba</p>
                 <div className="flex space-x-4">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">🤍</div>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs">💬</div>
                 </div>
               </div>
               <div className="text-gray-500 text-sm z-0 flex flex-col items-center">
                  <span className="text-4xl mb-2">▶</span>
                  TikTok Video Placeholder
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
