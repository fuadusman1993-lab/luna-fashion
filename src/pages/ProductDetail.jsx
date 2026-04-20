import { useAppContext } from '../context/AppContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toggleWishlist, isInWishlist } = useAppContext();
  
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('Black');

  // Route fallback state parameter fetching
  const product = state?.product;

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
         <h2>Loading product details...</h2>
         <button onClick={() => navigate(-1)} className="mt-4 text-gold border border-gold px-4 py-2">Go Back</button>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const WHATSAPP_NUMBER = "+251977799797"; 

  const handleWhatsAppOrder = () => {
    const text = `Hello Luna Fashion! I would like to order the *${product.name}*.\nPrice: ${product.price} ETB\nSize: ${selectedSize}\nColor: ${selectedColor}\nIs it still available?`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const sizes = ['S', 'M', 'L', 'XL'];
  const colors = [
    { name: 'Black', hex: '#0a0a0a' },
    { name: 'Mocha', hex: '#6b4c3a' },
    { name: 'Ivory', hex: '#f8f5f0' }
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0a0a0a] sm:max-w-[480px] sm:mx-auto sm:border-x sm:border-gray-800 pb-[100px] font-sans">
      
      {/* Fixed Sticky Header for precise Back navigation over the image */}
      <div className="fixed top-0 left-0 right-0 mx-auto w-full z-50 flex justify-between items-center px-4 py-4 bg-gradient-to-b from-black/60 to-transparent sm:max-w-[480px]">
         <button onClick={() => navigate(-1)} className="w-[38px] h-[38px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm border border-white/20">
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
         </button>
          <div className="flex space-x-3">
             <button className="w-[38px] h-[38px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm border border-white/20">
                <Share2 className="w-[18px] h-[18px]" strokeWidth={2} />
             </button>
             <button onClick={() => toggleWishlist(product.id)} className="w-[38px] h-[38px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm border border-white/20 active:scale-90">
                <Heart 
                  className={`w-[18px] h-[18px] transition-colors ${isWished ? 'text-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]' : ''}`} 
                  fill={isWished ? '#D4AF37' : 'none'}
                  strokeWidth={isWished ? 0 : 2} 
                />
             </button>
          </div>
       </div>

      {/* Snap-X Image Carousel Layer */}
      <div className="w-full h-[65vh] bg-gray-100 dark:bg-[#0f0f0f] relative overflow-hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
         {product.images && product.images.length > 0 ? (
           product.images.map((img, idx) => (
             <div key={idx} className="min-w-full h-full snap-start relative">
                 <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover object-center" />
             </div>
           ))
         ) : (
           <div className="min-w-full h-full snap-start relative">
               <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover object-center" />
           </div>
         )}

         {/* Overlay Carousel Indicators */}
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
             {(product.images && product.images.length > 0 ? product.images : [product.imageUrl]).map((_, idx) => (
               <div key={idx} className={`h-1 rounded-full ${idx === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
             ))}
         </div>

         {!product.inStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10 pointer-events-none">
               <div className="bg-black/80 text-white px-6 py-2 border border-white/20 text-sm font-bold uppercase tracking-widest backdrop-blur-sm">Sold Out</div>
            </div>
         )}
      </div>

      {/* Product Content Sheet */}
      <div className="px-4 py-5 bg-white dark:bg-[#0a0a0a]">
         <div className="flex justify-between items-start mb-1">
            <h1 className="text-[17px] font-bold leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 max-w-[85%] font-sans tracking-wide">{product.name}</h1>
         </div>

         <div className="flex items-end space-x-2 mt-4 mb-2">
            <span className="text-[24px] font-black text-black dark:text-white leading-none tracking-tight">
               {Number(product.price).toLocaleString()}
            </span>
            <span className="text-[12px] font-bold text-gray-500 mb-0.5 tracking-wider">ETB</span>
         </div>
         
         <p className="text-[12px] text-gray-400 mb-6 tracking-wide">* Pricing is fixed natively across all platforms</p>

         {/* Selection Variants - Color */}
         <div className="mb-6">
            <h3 className="text-[11px] font-bold uppercase tracking-widest mb-3 text-gray-900 dark:text-gray-300">Color: <span className="text-gray-500 ml-1">{selectedColor}</span></h3>
            <div className="flex space-x-3">
               {colors.map((color) => (
                  <button 
                     key={color.name}
                     onClick={() => setSelectedColor(color.name)}
                     className={`w-8 h-8 rounded-full border-2 transition-all flex justify-center items-center ${selectedColor === color.name ? 'border-gold p-0.5' : 'border-transparent hover:scale-110'}`}
                  >
                     <div className="w-full h-full rounded-full border border-gray-200 dark:border-gray-800" style={{ backgroundColor: color.hex }}></div>
                  </button>
               ))}
            </div>
         </div>

         {/* Selection Variants - Size */}
         <div className="mb-6">
            <div className="flex justify-between items-end mb-3">
               <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300">Size</h3>
               <span className="text-[10px] text-gray-400 underline decoration-gray-400">Size Guide</span>
            </div>
            <div className="flex space-x-3">
               {sizes.map((size) => (
                  <button 
                     key={size}
                     onClick={() => setSelectedSize(size)}
                     className={`w-12 h-10 border transition-colors text-[13px] font-bold flex items-center justify-center ${selectedSize === size ? 'bg-black text-white dark:bg-gold dark:text-black border-black dark:border-gold' : 'bg-transparent text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-gold'}`}
                  >
                     {size}
                  </button>
               ))}
            </div>
         </div>

         {/* Product Details Block */}
         <div className="border-t border-gray-100 dark:border-gray-900 pt-6 mt-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-black dark:text-gold w-max border-b-2 border-black dark:border-gold pb-1">Item Description</h3>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 font-light leading-relaxed">
               {product.description || "Premium imported style matching strict luxury guidelines perfectly. Detailed stitching and high quality aesthetic output."}
            </p>
         </div>
         
         {/* Shipping Rules Wrapper */}
         <div className="border-t border-gray-100 dark:border-gray-900 pt-5 mt-5 bg-[#fafafa] dark:bg-[#111111] p-4 rounded-md">
             <div className="flex justify-between items-center text-[11px] text-gray-500">
                 <span className="uppercase tracking-wider font-semibold text-black dark:text-white">Shipping</span>
                 <span className="font-bold text-green-600 dark:text-green-500">Ships from Ethiopia</span>
             </div>
             <p className="text-[10px] mt-1 text-gray-400">Arrives in 1-2 business days with standard courier tracking.</p>
         </div>
      </div>

      {/* Fixed Sticky Action Bar Base */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto z-50 bg-[#111111] border-t border-white/5 px-4 py-3 sm:max-w-[480px] sm:border-x sm:border-gray-800 pb-safe flex items-center justify-between">
         <div className="flex-1 mr-3">
            <button onClick={() => toggleWishlist(product.id)} className="w-[50px] h-[50px] border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors shrink-0 active:scale-90">
               <Heart 
                 className={`w-[20px] h-[20px] transition-colors ${isWished ? 'text-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : 'text-white'}`} 
                 fill={isWished ? '#D4AF37' : 'none'}
                 strokeWidth={isWished ? 0 : 1.5} 
               />
            </button>
         </div>
         <button 
           onClick={handleWhatsAppOrder}
           disabled={!product.inStock}
           className="w-full relative overflow-hidden group flex-shrink-0 bg-[#D4AF37] text-black h-[50px] font-bold uppercase tracking-widest flex-[3] text-[12px] flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 transition-all active:scale-95 hover:scale-[1.02]"
         >
           <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
           <ShoppingBag className="w-4 h-4 mr-2" strokeWidth={2.5} />
           <span className="relative">Add To Cart</span>
         </button>
      </div>

    </div>
  );
}
