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

const DesktopVideoCard = memo(({ product }) => {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useAppContext();

  return (
    <div 
      className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-[#111] group cursor-pointer border border-white/10 hover:border-[#D4AF37]/50 transition-colors shadow-lg"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
         if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
         }
      }}
      onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
    >
      <video
        ref={videoRef}
        src={product.videoUrl}
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
      />
      {/* Overlay details */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col justify-end h-1/2">
         <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">{product.name}</h3>
         <div className="flex justify-between items-center mt-auto">
            <p className="text-[#D4AF37] font-bold text-sm">{Number(product.price).toLocaleString()} <span className="text-[10px] text-gray-300">ETB</span></p>
            <button 
              onClick={(e) => { e.stopPropagation(); addToCart({ ...product, qty: 1 }); }}
              className="bg-[#D4AF37] text-black p-2 rounded-full hover:scale-105 active:scale-95 transition-transform"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={2.5} />
            </button>
         </div>
      </div>
    </div>
  );
});

export default function VideoFeed({ initialProductId, onClose }) {
  const { products } = useProducts();
  const [videoProducts, setVideoProducts] = useState([]);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className={`fixed inset-0 z-[100] ${isDesktop ? 'bg-black/95 overflow-y-auto' : 'bg-black overflow-hidden'}`}>
      {/* Close Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`absolute z-50 bg-black/40 text-white p-2 rounded-full backdrop-blur-md border border-white/20 hover:bg-black/60 transition-colors ${isDesktop ? 'top-6 right-8' : 'top-6 right-6'}`}
      >
        <X className="w-6 h-6" />
      </button>

      {isDesktop ? (
        <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
           <h2 className="text-3xl font-serif text-white mb-8 text-center uppercase tracking-widest">Video Gallery</h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videoProducts.map(product => (
                <DesktopVideoCard key={product.id} product={product} />
              ))}
           </div>
        </div>
      ) : (
        /* Vertical Snap Container */
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
      )}
    </div>
  );
}
