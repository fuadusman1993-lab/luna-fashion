import { useAppContext } from '../../context/AppContext';
import { ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

const ProductCard = memo(function ProductCard({ product }) {
  const { t, isInWishlist, toggleWishlist, addToCart } = useAppContext();
  const navigate = useNavigate();

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
    <div onClick={navigateToProduct} className="relative flex flex-col bg-white dark:bg-[#0a0a0a] overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 shadow cursor-pointer transition-colors duration-300 h-full">
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-50 dark:bg-[#0f0f0f]">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
        />

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
          <p className="font-bold text-[14px] tracking-tight text-red-600 dark:text-red-500">
            {Number(product.price).toLocaleString()} <span className="text-[9px] font-medium text-gray-500">ETB</span>
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
    </div>
  );
});

export default ProductCard;
