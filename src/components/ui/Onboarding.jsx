import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Onboarding({ onComplete }) {
  const { language, toggleLanguage } = useAppContext();

  // Faint dotted map placeholder using CSS background pattern for luxury feel
  const mapStyle = {
    backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px)`,
    backgroundSize: '15px 15px',
    backgroundPosition: 'center',
    maskImage: 'radial-gradient(ellipse at center, black, transparent 70%)',
    WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 70%)'
  };

  return (
    <div className="fixed inset-0 z-[100] bg-luna-white dark:bg-luna-black text-luna-black dark:text-luna-white transition-colors flex items-center justify-center sm:bg-gray-100 sm:dark:bg-[#070707] p-0 sm:p-6 overflow-y-auto">
       <div className="w-full min-h-screen sm:min-h-[600px] sm:h-auto sm:max-h-[85vh] sm:max-w-[420px] bg-luna-white dark:bg-luna-black sm:rounded-3xl flex flex-col justify-between overflow-y-auto sm:border border-gray-200 dark:border-gray-800 shadow-2xl relative">
      
      {/* Top Map Section */}
      <div className="relative h-[30vh] flex items-center justify-center p-6 mt-10">
          {/* Map Image Background */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-80"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop")' }}
          >
             <div className="absolute inset-0 bg-black/60"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4"
          >
            <h1 className="text-3xl md:text-4xl font-serif text-center tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] leading-snug">
              WELCOME TO<br/>LUNA FASHION
            </h1>
          </motion.div>
      </div>

      {/* Middle Settings Panel */}
      <div className="flex-1 py-4 px-8 space-y-0 mt-8">
         {/* Location */}
         <div className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-800">
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 font-display tracking-wider">Location</p>
               <p className="font-semibold text-lg">Ethiopia</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
         </div>

         {/* Language (Functional Toggle) */}
         <button onClick={toggleLanguage} className="w-full text-left flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-800 focus:outline-none">
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 font-display tracking-wider">Language</p>
               <p className="font-semibold text-lg">{language === 'en' ? 'English' : 'አማርኛ'}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
         </button>

         {/* Currency */}
         <div className="flex justify-between items-center py-6 border-b border-gray-200 dark:border-gray-800">
            <div>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 font-display tracking-wider">Currency</p>
               <p className="font-semibold text-lg">ETB</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
         </div>
      </div>

      {/* Bottom Action */}
      <div className="p-8 pb-16">
        <button 
          onClick={onComplete}
          className="w-full bg-luna-black dark:bg-gold text-luna-white dark:text-black py-4 font-bold text-lg uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm shadow-xl shadow-gold/10"
        >
          Shop Now
        </button>
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs mt-6 font-light">
          You can go to the "Settings" page to modify later
        </p>
      </div>

      </div>
    </div>
  );
}
