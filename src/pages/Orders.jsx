import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2, MessageSquare, ThumbsUp, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

export default function Orders() {
  const navigate = useNavigate();
  const { getUserOrders, loading } = useOrders();
  const [orders, setOrders] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSendThanks = () => {
    const text = `✨ *Thank You!* ✨\n\nI just wanted to express my appreciation for your service. Everything was great!`;
    const telegramUrl = `https://t.me/Luna_market1?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = telegramUrl; link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    const text = `📝 *Customer Feedback* 📝\n\n${feedbackText}`;
    const telegramUrl = `https://t.me/Luna_market1?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = telegramUrl; link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setShowFeedback(false);
    setFeedbackText('');
  };

  useEffect(() => {
    async function fetchOrders() {
      const data = await getUserOrders();
      setOrders(data);
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505] font-sans pb-[100px] md:max-w-2xl mx-auto w-full relative z-0">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 flex justify-between items-center px-4 py-4 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 md:max-w-2xl mx-auto">
         <button onClick={() => navigate(-1)} className="w-[40px] h-[40px] rounded-full flex items-center justify-center text-black dark:text-white bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform active:scale-95 shadow-sm">
            <ArrowLeft className="w-[20px] h-[20px]" strokeWidth={2} />
         </button>
         <h1 className="text-[16px] font-bold tracking-widest uppercase text-black dark:text-white">My Orders</h1>
         <div className="w-[40px] h-[40px]"></div>
      </div>

      <div className="px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mb-4"></div>
             Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
             <Package className="w-12 h-12 mb-4 text-gray-300 dark:text-gray-700" />
             <h3 className="text-black dark:text-white font-bold tracking-wide mb-2">No Orders Found</h3>
             <p className="text-xs text-center leading-relaxed">You haven't placed any orders yet. Once you do, they will appear here.</p>
             <button onClick={() => navigate('/shop')} className="mt-6 bg-gold text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm">
               Start Shopping
             </button>
          </div>
        ) : (
          <div className="space-y-4">
             {orders.map(order => (
               <div key={order.id} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-800 pb-3">
                     <div>
                       <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-1">Order ID: {order.id.slice(-6)}</span>
                       <span className="text-xs text-black dark:text-white font-medium">
                          {order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                       </span>
                     </div>
                     <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center ${order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                        {order.status === 'pending' ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {order.status || 'Pending'}
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     {order.items?.map((item, idx) => (
                       <div key={idx} className="flex items-center space-x-3">
                          <img src={item.imageUrl || item.images?.[0]} alt={item.name} className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-gray-700" />
                          <div className="flex-1">
                             <h4 className="text-xs font-bold text-black dark:text-white line-clamp-1">{item.name}</h4>
                             <p className="text-[10px] text-gray-500">Qty: {item.qty} | {item.size} | {item.color}</p>
                          </div>
                          <span className="text-xs font-bold text-black dark:text-white">{item.price} ETB</span>
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total</span>
                     <span className="text-sm font-bold text-gold">{order.totalPrice || order.items?.reduce((acc, i) => acc + (i.price * i.qty), 0)} ETB</span>
                  </div>
               </div>
             ))}
             
             {/* Global Feedback & Thanks Section */}
             <div className="mt-6 bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative">
                <h3 className="font-bold text-[14px] text-black dark:text-white tracking-wide mb-1">How was your experience?</h3>
                <p className="text-[11px] text-gray-500 mb-4">Let us know or simply send a quick thanks!</p>
                
                {showFeedback ? (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="relative">
                      <textarea 
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Type your feedback here..."
                        className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-3 pr-10 text-[13px] text-black dark:text-white outline-none focus:border-gold transition-colors min-h-[100px] resize-none"
                      />
                      <button 
                        onClick={() => setShowFeedback(false)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={handleSendFeedback}
                        disabled={!feedbackText.trim()}
                        className="flex-1 bg-black dark:bg-white text-white dark:text-black rounded-xl py-3 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 mr-2" />
                        Send via Telegram
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowFeedback(true)}
                      className="flex-1 bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-xl py-3 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Feedback
                    </button>
                    <button 
                      onClick={handleSendThanks}
                      className="flex-1 bg-gold text-black rounded-xl py-3 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_10px_rgba(212,175,55,0.3)]"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Thanks
                    </button>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
