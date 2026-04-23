import { useAppContext } from '../context/AppContext';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';
import { useNavigate } from 'react-router-dom';
import { Heart, HeartOff, ArrowLeft } from 'lucide-react';

export default function Wishlist() {
  const { wishlist } = useAppContext();
  const { products, loading } = useProducts();
  const navigate = useNavigate();

  // Filter products that are in the user's wishlist
  const wishlistProducts = (products || []).filter(p => wishlist.includes(p.id));

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen font-sans flex flex-col w-full mx-auto relative z-0">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 w-full z-10 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-white/5 px-4 py-4 flex items-center shadow-sm">
        <button onClick={() => navigate(-1)} className="mr-4 text-black dark:text-white hover:text-gold transition-colors active:scale-95">
          <ArrowLeft strokeWidth={2} className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-bold tracking-wider uppercase flex items-center">
          <Heart className="w-5 h-5 mr-2 text-gold fill-gold" />
          My Wishlist
        </h1>
        <span className="ml-auto text-[10px] text-gray-400 font-medium">{wishlistProducts.length} items</span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-[100px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        ) : wishlistProducts.length > 0 ? (
          <ProductGrid products={wishlistProducts} />
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="w-20 h-20 bg-gray-50 dark:bg-[#111] rounded-full flex items-center justify-center mb-5 border border-gray-100 dark:border-white/5">
              <HeartOff className="w-10 h-10 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-display text-black dark:text-white mb-2 uppercase tracking-wide">Your wishlist is empty</h2>
            <p className="text-[13px] text-gray-500 mb-8 max-w-[250px] leading-relaxed">
              Tap the heart icon on any product to save your favorite styles here.
            </p>
            <button 
              onClick={() => navigate('/shop')} 
              className="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest py-4 px-10 text-[12px] rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all"
            >
              Start Browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
