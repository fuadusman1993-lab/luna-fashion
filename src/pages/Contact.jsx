import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Phone, Navigation, Instagram, MessageCircle } from 'lucide-react';

export default function Contact() {
  const { t } = useAppContext();

  return (
    <div className="bg-luna-white dark:bg-luna-black text-luna-black dark:text-luna-white min-h-screen py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display uppercase tracking-widest mb-4">{t('contact')}</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          <p className="text-gray-500 font-light max-w-2xl mx-auto dark:text-gray-400">
             We would love to hear from you. Visit our boutique or connect with us online.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 max-w-4xl mx-auto">
          {/* Contact Details */}
          <div className="space-y-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
             <div className="flex items-start space-x-4">
                 <Navigation className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                 <div>
                     <h3 className="font-display text-xl uppercase tracking-wider mb-2">Visit Us</h3>
                     <p className="font-light text-gray-600 dark:text-gray-300">
                         Sun Moon Star Mall Jemo 1<br />
                         1st floor, Shop Number 06<br />
                         Addis Ababa, Ethiopia
                     </p>
                 </div>
             </div>

             <div className="flex items-start space-x-4">
                 <Phone className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                 <div>
                     <h3 className="font-display text-xl uppercase tracking-wider mb-2">Call Us</h3>
                     <p className="font-light text-gray-600 dark:text-gray-300">
                         +251 97 779 9797
                     </p>
                 </div>
             </div>

             <div className="flex items-start space-x-4">
                 <MessageCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                 <div>
                     <h3 className="font-display text-xl uppercase tracking-wider mb-2">Telegram</h3>
                     <a href="https://t.me/lunafashion" target="_blank" rel="noreferrer" className="font-light text-gray-600 dark:text-gray-300 hover:text-gold transition-colors">
                         @lunafashion
                     </a>
                 </div>
             </div>

             <div className="flex items-start space-x-4">
                 <Instagram className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                 <div>
                     <h3 className="font-display text-xl uppercase tracking-wider mb-2">Instagram</h3>
                     <a href="https://instagram.com/lunafashion" target="_blank" rel="noreferrer" className="font-light text-gray-600 dark:text-gray-300 hover:text-gold transition-colors">
                         @lunafashion.et
                     </a>
                 </div>
             </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-luna-black border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
             <h3 className="font-display text-2xl uppercase tracking-widest mb-6">Send a Message</h3>
             <form className="space-y-6">
                <div>
                   <label className="block text-sm font-medium mb-1">Full Name</label>
                   <input type="text" className="w-full border-gray-300 border dark:border-gray-700 bg-transparent p-3 focus:ring-gold focus:border-gold outline-none transition-colors" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Email Address</label>
                   <input type="email" className="w-full border-gray-300 border dark:border-gray-700 bg-transparent p-3 focus:ring-gold focus:border-gold outline-none transition-colors" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1">Message</label>
                   <textarea rows="4" className="w-full border-gray-300 border dark:border-gray-700 bg-transparent p-3 focus:ring-gold focus:border-gold outline-none transition-colors"></textarea>
                </div>
                <button type="button" className="w-full bg-luna-black dark:bg-gold dark:text-black text-white p-4 uppercase tracking-wider font-semibold hover:bg-gold hover:text-black transition-colors">
                   Send Message
                </button>
             </form>
          </div>
        </div>

      </div>
    </div>
  );
}
