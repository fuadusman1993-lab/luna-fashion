import { useAppContext } from '../../context/AppContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memo, useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const ProductCard = memo(function ProductCard({ product, index = 0 }) {
  const { t, isInWishlist, toggleWishlist, addToCart } = useAppContext();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.5 });
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch(e => console.log('Auto-play failed', e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const navigateToProduct = () => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  // Determine mock tags based on price/stock
  const isBestseller = product.isBestseller === true;
  const isNew = product.price <= 2000 && product.inStock;

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };
  const isWished = isInWishlist(product.id);

  return (
    <div 
      ref={ref}
      onClick={navigateToProduct} 
      className="relative flex flex-col bg-white dark:bg-[#0a0a0a] overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 shadow cursor-pointer transition-all duration-300 h-full group hover:shadow-xl hover:border-gold/30 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative w-full aspect-square overflow-hidden bg-gray-50 dark:bg-[#0f0f0f]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover rounded-t-xl transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {product.videoUrl && (
          <div 
            onClick={(e) => { e.stopPropagation(); setIsVideoExpanded(true); }}
            className="absolute bottom-2 right-2 w-16 h-24 border-2 border-gold/50 rounded overflow-hidden shadow-lg z-10 cursor-pointer hover:scale-105 transition-transform bg-black/50"
          >
            <video
              ref={videoRef}
              src={product.videoUrl}
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Wishlist Button Layer */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full text-black dark:text-white hover:bg-white dark:hover:bg-black/60 transition-colors z-10 border border-gray-200 dark:border-white/10 active:scale-90 shadow-sm"
        >
          <Heart
            className={`w-[14px] h-[14px] transition-colors ${isWished ? 'text-red-500 drop-shadow-sm' : 'text-gray-800 dark:text-white'}`}
            fill={isWished ? '#ef4444' : 'none'}
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

        {/* AliExpress Badges */}
        {isBestseller && product.inStock && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[12px] font-bold px-2 py-0.5 rounded-sm flex items-center shadow-md">
            Bestseller
          </div>
        )}
        {isNew && product.inStock && (
          <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-md flex items-center">
            New Arrival
          </div>
        )}
      </div>

      <div className="p-2 flex flex-col bg-white dark:bg-[#0a0a0a]">
        <h3 className="text-[13px] text-green-600 dark:text-green-500 line-clamp-2 leading-tight font-medium mb-1">{product.name}</h3>

        <div className="flex justify-between items-center mt-auto">
          <p className="font-bold text-[14px] tracking-tight text-[#D4AF37] dark:text-white">
             {Number(product.price).toLocaleString()} <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400">ETB</span>
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="bg-black text-white dark:bg-[#D4AF37] dark:text-black p-1.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100"
          >
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>

        {isBestseller && product.inStock && (
          <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider font-semibold">High Repeat Customers</p>
        )}
      </div>

      {isVideoExpanded && product.videoUrl && (
         <div 
           className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
           onClick={(e) => { e.stopPropagation(); setIsVideoExpanded(false); }}
         >
            <video 
               src={product.videoUrl}
               autoPlay
               loop
               controls
               playsInline
               className="max-w-full max-h-full rounded shadow-2xl"
               onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={(e) => { e.stopPropagation(); setIsVideoExpanded(false); }}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 px-4 py-2 rounded-full font-bold tracking-wider text-sm transition-colors"
            >
              CLOSE
            </button>
         </div>
      )}
    </div>
  );
});

export default ProductCard;
