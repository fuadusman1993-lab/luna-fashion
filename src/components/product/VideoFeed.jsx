import { useEffect, useState, useRef, memo } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useAppContext } from '../../context/AppContext';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const VideoSlide = memo(({ product }) => {
  const { ref, inView } = useInView({ threshold: 0.6 });
  const videoRef = useRef(null);
  const { addToCart } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play().catch(e => console.log('Auto-play failed', e));
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [inView]);

  return (
    <div ref={ref} className="h-screen w-full snap-start relative bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={product.videoUrl}
        loop
        playsInline
        muted={false}
        className="w-full h-full object-cover"
        onClick={(e) => {
          e.stopPropagation();
          if (videoRef.current) {
            if (videoRef.current.paused) videoRef.current.play();
            else videoRef.current.pause();
          }
        }}
      />
      
      {/* Bottom Overlay Card */}
      <div className="absolute bottom-0 left-0 w-full p-4 pb-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
        <div 
           className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-white/20 transition-colors"
           onClick={() => {
              navigate(`/product/${product.id}`, { state: { product } });
           }}
        >
          <img src={product.imageUrl} alt={product.name} className="w-16 h-16 rounded-lg object-cover bg-white" />
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm line-clamp-1">{product.name}</h3>
            <p className="text-[#D4AF37] font-bold text-lg">{Number(product.price).toLocaleString()} <span className="text-xs text-gray-300">ETB</span></p>
          </div>
          <button 
            onClick={(e) => {
               e.stopPropagation();
               addToCart({ ...product, qty: 1 });
            }}
            className="bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-transform flex items-center"
          >
            <ShoppingBag className="w-4 h-4 mr-1" strokeWidth={2.5} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

export default function VideoFeed({ initialProductId, onClose }) {
  const { products } = useProducts();
  const [videoProducts, setVideoProducts] = useState([]);

  useEffect(() => {
    let list = products.filter(p => p.videoUrl);
    
    // Ensure the initial product is at the top of the feed
    if (initialProductId) {
      const initialIdx = list.findIndex(p => p.id === initialProductId);
      if (initialIdx > -1) {
        const initialP = list[initialIdx];
        list.splice(initialIdx, 1);
        list.unshift(initialP);
      }
    }
    setVideoProducts(list);
  }, [products, initialProductId]);

  return (
    <div className="fixed inset-0 z-[100] bg-black overflow-hidden">
      {/* Close Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 z-50 bg-black/40 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-black/60 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Vertical Snap Container */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {videoProducts.length > 0 ? (
          videoProducts.map(product => (
            <VideoSlide key={product.id} product={product} />
          ))
        ) : (
          <div className="h-full w-full flex items-center justify-center text-white">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
