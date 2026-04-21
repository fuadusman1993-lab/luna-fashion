import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, Plus, Minus, MapPin, CheckCircle2 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductGrid from '../components/product/ProductGrid';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useAppContext();
  const { products } = useProducts();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);

  // Recommendations: top 6 products from the global store
  const recommendations = products ? products.slice(0, 6) : [];

  const handleCheckout = () => {
    let text = "✨ *Luna Fashion Order Request* ✨\n\n";
    cart.forEach(item => {
      const qty = item.qty || 1;
      text += `🛍️ *${item.name}*\n`;
      text += `   ↳ Variant: ${item.size} / ${item.color}\n`;
      text += `   ↳ Qty: ${qty} x ${Number(item.price).toLocaleString()} ETB\n`;
      text += `   ↳ Subtotal: ${(Number(item.price) * qty).toLocaleString()} ETB\n\n`;
    });
    text += `💳 *Final Total: ${total.toLocaleString()} ETB*\n`;
    text += "📍 Shipping to: Ethiopia\n\n";
    text += "Is this available to order?";
    
    const encodedText = encodeURIComponent(text);
    const telegramUrl = `https://t.me/+251977799797?text=${encodedText}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-[160px] flex flex-col relative w-full overflow-x-hidden">
      {/* Sticky Top Header */}
      <div className="sticky top-0 left-0 right-0 w-full bg-white dark:bg-[#0a0a0a] z-50 shadow-sm border-b border-gray-100 dark:border-white/5 pt-2 pb-3 px-4">
        <div className="flex items-center justify-center relative mb-2 mt-2">
          <button onClick={() => navigate(-1)} className="absolute left-0 p-2 -ml-2 text-black dark:text-white hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <h1 className="text-[16px] font-bold text-black dark:text-white tracking-wide">
            Cart ({totalItems})
          </h1>
        </div>
        
        {/* Ship to Location Indicator */}
        <div className="flex items-center justify-center text-[12px] text-gray-600 dark:text-gray-400 font-medium bg-gray-50 dark:bg-[#111] py-1.5 rounded-full px-4 w-max mx-auto border border-gray-100 dark:border-white/5">
          <MapPin className="w-3.5 h-3.5 mr-1 text-black dark:text-white" strokeWidth={2} />
          Ship to <span className="text-black dark:text-white font-bold ml-1">Ethiopia</span>
        </div>
      </div>

      <div className="px-3 pt-4 flex-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-[#111] rounded-full flex items-center justify-center mb-6 border border-gray-200 dark:border-gray-800">
               <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h2 className="text-lg font-bold text-black dark:text-white mb-2 font-serif tracking-wide">Your cart is empty</h2>
            <p className="text-[13px] text-gray-500 mb-8 max-w-[250px] mx-auto leading-relaxed">Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate('/shop')} className="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider py-3.5 px-10 text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Cart Items */}
            <div className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5 p-1">
              {cart.map((item, index) => (
                <div key={item.cartId} className={`flex p-3 ${index !== cart.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''}`}>
                  {/* High-quality thumbnail */}
                  <div className="relative shrink-0">
                    <img 
                      src={item.image || item.imageUrl || (item.images && item.images[0])} 
                      alt={item.name} 
                      className="w-[90px] h-[120px] object-cover rounded-lg bg-gray-100 dark:bg-[#222]" 
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="ml-3 flex-1 flex flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[13px] font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 pr-2">
                        {item.name}
                      </h3>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1 transition-colors">
                        <Trash2 className="w-[16px] h-[16px]" strokeWidth={1.5} />
                      </button>
                    </div>
                    
                    {/* Variant styling */}
                    <div className="mt-2 flex items-center bg-gray-50 dark:bg-[#1a1a1a] rounded px-2 py-1 w-max border border-gray-100 dark:border-white/5">
                       <span className="text-[11px] text-gray-600 dark:text-gray-400">{item.color} / {item.size}</span>
                    </div>

                    <div className="flex justify-between items-end mt-3">
                      <span className="font-bold text-[15px] text-black dark:text-white">
                        {Number(item.price).toLocaleString()} <span className="text-[10px] font-normal text-gray-500">ETB</span>
                      </span>
                      
                      {/* Professional Quantity Selector */}
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-black overflow-hidden h-[28px]">
                        <button 
                          onClick={() => updateQuantity(item.cartId, -1)}
                          className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
                        >
                          <Minus className="w-3 h-3" strokeWidth={2} />
                        </button>
                        <span className="w-6 text-center text-[12px] font-bold text-black dark:text-white">
                          {item.qty || 1}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.cartId, 1)}
                          className="w-8 h-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
                        >
                          <Plus className="w-3 h-3" strokeWidth={2} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Store Guarantees */}
            <div className="flex justify-around items-center bg-white dark:bg-[#111111] rounded-xl p-3 shadow-sm border border-gray-100 dark:border-white/5">
               <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" strokeWidth={2} />
                  Safe Payment
               </div>
               <div className="w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white" strokeWidth={2} />
                  Premium Quality
               </div>
            </div>
          </div>
        )}

        {/* 'You Might Like' Section */}
        <div className="mt-10 mb-6">
          <div className="flex items-center justify-center mb-6">
            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800"></div>
            <h3 className="px-4 text-[14px] font-bold text-black dark:text-white uppercase tracking-widest text-center font-serif">
              You Might Like to Fill it With
            </h3>
            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-800"></div>
          </div>
          
          <div className="-mx-1">
             <ProductGrid products={recommendations} />
          </div>
        </div>
      </div>

      {/* Fixed Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-[65px] left-0 right-0 w-full z-40 bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-white/10 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_30px_rgba(0,0,0,0.5)] max-w-[430px] mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex flex-col pr-4">
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Total</span>
              <span className="font-bold text-[18px] text-black dark:text-white leading-none">
                {total.toLocaleString()} <span className="text-[12px] font-normal text-gray-500 ml-0.5">ETB</span>
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="flex-1 bg-black dark:bg-white text-white dark:text-black h-[48px] rounded-full font-bold uppercase tracking-widest text-[13px] flex items-center justify-center shadow-md active:scale-95 transition-all"
            >
              Checkout ({totalItems})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
