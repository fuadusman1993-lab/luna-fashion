import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingBag } from 'lucide-react';

export default function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

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

  const WHATSAPP_NUMBER = "+251977799797"; 

  const handleWhatsAppOrder = () => {
    const text = `Hello Luna Fashion! I would like to order the *${product.name}*.\nPrice: ${product.price} ETB\nIs it still available?`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0a0a0a] sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-800 pb-[100px]">
      
      {/* Fixed Sticky Header for precise Back navigation over the image */}
      <div className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-4 bg-gradient-to-b from-black/60 to-transparent sm:max-w-md">
         <button onClick={() => navigate(-1)} className="w-[38px] h-[38px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm border border-white/20">
            <ArrowLeft className="w-[18px] h-[18px]" strokeWidth={2.5} />
         </button>
         <div className="flex space-x-3">
            <button className="w-[38px] h-[38px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm border border-white/20">
               <Share2 className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
            <button className="w-[38px] h-[38px] bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors shadow-sm border border-white/20">
               <Heart className="w-[18px] h-[18px]" strokeWidth={2} />
            </button>
         </div>
      </div>

      {/* Main Hero Product Image */}
      <div className="w-full h-[65vh] bg-gray-100 dark:bg-[#0f0f0f] relative overflow-hidden">
         <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover object-center" />
         {!product.inStock && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
               <div className="bg-black/80 text-white px-6 py-2 border border-white/20 text-sm font-bold uppercase tracking-widest backdrop-blur-sm">Sold Out</div>
            </div>
         )}
      </div>

      {/* Product Content Sheet */}
      <div className="px-4 py-5 bg-white dark:bg-[#0a0a0a]">
         <div className="flex justify-between items-start mb-2">
            <h1 className="text-[17px] font-bold leading-tight text-gray-900 dark:text-gray-100 line-clamp-2 max-w-[85%] font-sans tracking-wide">{product.name}</h1>
         </div>

         <div className="flex items-end space-x-2 mt-3 mb-6">
            <span className="text-[22px] font-black text-black dark:text-white leading-none tracking-tight">
               {Number(product.price).toLocaleString()}
            </span>
            <span className="text-[11px] font-bold text-gray-500 mb-0.5 tracking-wider">ETB</span>
         </div>

         <div className="flex items-center space-x-3 mb-6">
            <div className="flex text-gold">
               {'★★★★★'.split('').map((star, i) => <span key={i} className="text-sm">{star}</span>)}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">4.9 (128 reviews)</span>
         </div>

         {/* Product Details Block */}
         <div className="border-t border-gray-100 dark:border-gray-900 pt-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-black dark:text-gold w-max border-b-2 border-black dark:border-gold pb-1">Item Description</h3>
            <p className="text-[13px] text-gray-600 dark:text-gray-400 font-light leading-relaxed">
               {product.description || "Premium imported style matching strict luxury guidelines perfectly. Detailed stitching and high quality aesthetic output."}
            </p>
         </div>
         
         <div className="border-t border-gray-100 dark:border-gray-900 pt-5 mt-5">
             <div className="flex justify-between items-center text-[11px] text-gray-500">
                 <span className="uppercase tracking-wider font-semibold">Category</span>
                 <span className="font-bold text-black dark:text-gray-300">{product.category || "Women"}</span>
             </div>
             <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2">
                 <span className="uppercase tracking-wider font-semibold">Shipping</span>
                 <span className="font-bold text-black dark:text-gray-300">Ships from Ethiopia</span>
             </div>
         </div>
      </div>

      {/* Fixed Sticky Action Bar Base */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-gray-800 px-4 py-3 sm:max-w-md sm:mx-auto sm:border-x sm:border-gray-800 pb-safe flex items-center justify-between">
         <div className="flex-1 mr-3">
            <button className="w-[50px] h-[50px] border border-gray-200 dark:border-gray-700 flex items-center justify-center rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0">
               <Heart className="w-[20px] h-[20px] text-luna-black dark:text-white" strokeWidth={1.5} />
            </button>
         </div>
         <button 
           onClick={handleWhatsAppOrder}
           disabled={!product.inStock}
           className="w-full relative overflow-hidden group flex-shrink-0 bg-black text-white dark:bg-gold dark:text-black h-[50px] font-bold uppercase tracking-widest flex-[3] text-[12px] flex items-center justify-center shadow-lg disabled:opacity-50 transition-transform active:scale-95"
         >
           <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white/20 rounded-full group-hover:w-56 group-hover:h-56"></span>
           <ShoppingBag className="w-4 h-4 mr-2" strokeWidth={2.5} />
           <span className="relative">Add To Cart</span>
         </button>
      </div>

    </div>
  );
}
