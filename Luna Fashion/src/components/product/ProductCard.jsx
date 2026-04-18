import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function ProductCard({ product }) {
  const { t } = useAppContext();
  const WHATSAPP_NUMBER = "+251977799797"; 

  const handleWhatsAppOrder = () => {
    const text = `Hello Luna Fashion! I would like to order the *${product.name}*.\nPrice: ${product.price} ${product.currency}\nIs it still available?`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-black">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 flex items-center justify-center">
            <span className="text-white font-display text-lg uppercase tracking-wider bg-black/60 px-4 py-2 border border-gold">
              {t('soldOut')}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col py-4 px-3 space-y-2">
        <h3 className="font-display text-lg text-luna-black dark:text-luna-white">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
        <p className="font-semibold text-lg text-luna-black dark:text-gold">{product.price.toLocaleString()} {product.currency}</p>
        
        <button
          onClick={handleWhatsAppOrder}
          disabled={!product.inStock}
          className={`mt-4 w-full flex items-center justify-center py-3 px-4 border text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
            product.inStock 
              ? 'border-luna-black bg-luna-black text-luna-white dark:border-gold dark:bg-gold dark:text-black hover:bg-gold hover:border-gold hover:text-black dark:hover:bg-transparent dark:hover:text-gold' 
              : 'border-gray-300 bg-gray-100 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
          }`}
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          {t('orderViaWhatsapp')}
        </button>
      </div>
    </motion.div>
  );
}
