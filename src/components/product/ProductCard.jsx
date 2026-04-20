import { useAppContext } from '../../context/AppContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const { t, isInWishlist, toggleWishlist } = useAppContext();
  const navigate = useNavigate();
  const WHATSAPP_NUMBER = "+251977799797"; 

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
    const text = `Hello Luna Fashion! I would like to order the *${product.name}*.\nPrice: ${product.price} ETB\nIs it still available?`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const navigateToProduct = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Determine mock tags based on price/stock
  const isBestseller = product.price > 2000;
  const isNew = product.price <= 2000 && product.inStock;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };
  const isWished = isInWishlist(product.id);

  return (
    <div onClick={navigateToProduct} className="relative flex flex-col bg-[#0a0a0a] overflow-hidden rounded-md border border-white/5 shadow-sm cursor-pointer transition-colors duration-300">
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0f0f0f]">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        
        {/* Wishlist Button Layer */}
        <button 
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10 border border-white/10 active:scale-90"
        >
          <Heart 
            className={`w-[14px] h-[14px] transition-colors ${isWished ? 'text-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]' : 'text-white'}`} 
            fill={isWished ? '#D4AF37' : 'none'} 
            strokeWidth={isWished ? 0 : 1.5}
          />
        </button>
        {!product.inStock && (
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
            <span className="text-white font-bold text-[10px] uppercase tracking-wider bg-black/60 px-2 py-1 rounded-sm border border-gold/30">
              {t('soldOut')}
            </span>
          </div>
        )}
        
        {/* SHEIN Badges */}
        {isBestseller && product.inStock && (
          <div className="absolute bottom-1 right-1 bg-black/80 text-gold text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center shadow-lg">
             <span className="mr-0.5 text-xs">🔥</span> Bestseller
          </div>
        )}
        {isNew && product.inStock && (
          <div className="absolute bottom-1 left-1 bg-white/95 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-md flex items-center">
             <span className="mr-0.5 text-xs">✨</span> New In
          </div>
        )}
      </div>
      
      <div className="p-2 flex flex-col">
        <h3 className="text-[11px] text-gray-200 line-clamp-2 leading-tight font-medium mb-1">{product.name}</h3>
        
        <div className="flex justify-between items-center mt-auto">
           <p className="font-bold text-[14px] tracking-tight text-white">
              {Number(product.price).toLocaleString()} <span className="text-[9px] font-medium text-gray-500">ETB</span>
           </p>
           
           <button
             onClick={handleWhatsAppOrder}
             disabled={!product.inStock}
             className="bg-[#D4AF37] text-black p-1.5 rounded-full shadow-[0_0_12px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
           >
             <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2.5} />
           </button>
        </div>
        
        {isBestseller && product.inStock && (
           <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-semibold">High Repeat Customers</p>
        )}
      </div>
    </div>
  );
}
