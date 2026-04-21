import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart } = useAppContext();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0);

  const handleCheckout = () => {
    let text = "Hello Luna Fashion! I would like to order:\n\n";
    cart.forEach(item => {
      text += `- ${item.name} (${item.size}, ${item.color}) x${item.qty} - ${item.price} ETB\n`;
    });
    text += `\n*Total: ${total.toLocaleString()} ETB*`;
    text += "\n\nIs this available?";
    
    const encodedText = encodeURIComponent(text);
    const telegramUrl = `https://t.me/+251977799797?text=${encodedText}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10 z-50 max-w-[430px] mx-auto flex items-center justify-center p-4">
        <button onClick={() => navigate(-1)} className="absolute left-4 p-2 text-black dark:text-white hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <h1 className="text-sm font-bold text-black dark:text-white tracking-widest uppercase">Shopping Cart</h1>
      </div>

      <div className="pt-20 px-4 max-w-[430px] mx-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-center">
            <div className="w-20 h-20 bg-gray-200 dark:bg-[#111] rounded-full flex flex-col items-center justify-center mb-6 shadow-inner">
              <svg className="w-8 h-8 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <h2 className="text-lg font-bold text-black dark:text-white mb-2 font-serif text-xl tracking-wide">Your cart is empty</h2>
            <p className="text-[13px] text-gray-500 mb-8 max-w-[250px] mx-auto leading-relaxed">Looks like you haven't added anything to your cart yet.</p>
            <button onClick={() => navigate('/shop')} className="bg-black dark:bg-[#D4AF37] text-white dark:text-black font-bold uppercase tracking-wider py-4 px-10 text-xs rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all">
              Discover Products
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <div key={item.cartId} className="flex bg-white dark:bg-[#111111] p-3 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 relative">
                  <img src={item.image || item.imageUrl || (item.images && item.images[0])} alt={item.name} className="w-[85px] h-[105px] object-cover rounded-lg border border-gray-100 dark:border-white/5 shadow-sm" />
                  <div className="ml-4 flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-[13px] font-bold text-black dark:text-white font-serif tracking-wide pr-8">{item.name}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded-sm">Size: {item.size}</span>
                        <span className="text-[10px] font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded-sm flex items-center gap-1">
                          Color: 
                          <span className="w-2.5 h-2.5 rounded-full border border-gray-300 dark:border-gray-600 block" style={{ backgroundColor: item.color === 'Black' ? '#000' : item.color === 'Ivory' ? '#f8f5f0' : '#6b4c3a' }}></span>
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-3">
                      <span className="font-bold text-lg text-black dark:text-white flex items-baseline gap-1">
                        {Number(item.price).toLocaleString()} <span className="text-[10px] font-normal text-gray-500 tracking-wider">ETB</span>
                      </span>
                      <button onClick={() => removeFromCart(item.cartId)} className="p-2 -mr-2 -mb-2 text-gray-400 hover:text-red-500 active:scale-95 transition-all">
                        <Trash2 className="w-[18px] h-[18px]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <div className="bg-white dark:bg-[#111111] border border-gray-100 dark:border-white/5 rounded-xl p-5 shadow-sm space-y-3 mb-6">
              <div className="flex justify-between text-[13px] text-gray-600 dark:text-gray-400 font-medium">
                <span>Subtotal</span>
                <span>{total.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-[13px] text-gray-600 dark:text-gray-400 font-medium">
                <span>Delivery</span>
                <span className="text-[#10B981]">Arranged explicitly</span>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between font-bold text-lg text-black dark:text-white mt-4">
                <span>Total</span>
                <span className="text-black dark:text-[#D4AF37] font-serif">{total.toLocaleString()} ETB</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/10 px-4 py-4 max-w-[430px] mx-auto pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
          <button 
            onClick={handleCheckout}
            className="w-full bg-black dark:bg-[#D4AF37] text-white dark:text-black h-[55px] font-bold uppercase tracking-wider text-[12px] flex items-center justify-center rounded-xl shadow-lg active:scale-95 transition-all"
          >
            Checkout via Telegram
          </button>
        </div>
      )}
    </div>
  );
}
