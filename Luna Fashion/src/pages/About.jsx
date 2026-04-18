import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

export default function About() {
  const { t } = useAppContext();

  return (
    <div className="bg-luna-white dark:bg-luna-black text-luna-black dark:text-luna-white min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display uppercase tracking-widest mb-4">{t('about')}</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          
          <div className="max-w-3xl mx-auto mt-12 space-y-8 text-lg font-light leading-relaxed">
            <p>
              Luna Fashion is more than just a brand; it is a celebration of the modern woman. 
              Born in the heart of Addis Ababa, our designs merge global luxury standards with 
              a distinct, elegant aesthetic tailored for every occasion.
            </p>
            <p>
              We believe that every piece of clothing should make a statement. That's why we 
              painstakingly select only the finest fabrics, ensuring that our abayas, gowns, 
              and blazers are not just worn, but experienced.
            </p>
            <p>
              Welcome to the universe of Luna. Redefine elegance.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 text-center">
            <img src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2000&auto=format&fit=crop" alt="Luna Storefront View" className="w-full h-auto max-h-[500px] object-cover mx-auto" />
        </div>
      </div>
    </div>
  );
}
