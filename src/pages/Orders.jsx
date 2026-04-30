import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2, MessageSquare, ThumbsUp, X, Send, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

export default function Orders() {
  const navigate = useNavigate();
  const { getUserOrders, updateOrder, deleteOrder, loading } = useOrders();
  const [orders, setOrders] = useState([]);
  
  // State for active item interactions
  const [activeItemKey, setActiveItemKey] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const toggleItemActions = (orderId, idx) => {
    const key = `${orderId}-${idx}`;
    if (activeItemKey === key) {
      setActiveItemKey(null);
      setFeedbackText('');
    } else {
      setActiveItemKey(key);
      setFeedbackText('');
    }
  };

  const handleSendItemThanks = (order, item) => {
    const itemImage = item.imageUrl || item.images?.[0] || '';
    const text = `${itemImage ? itemImage + '\n\n' : ''}✨ *Thank You!* ✨\n\nI received the *${item.name}* (Order ID: ${order.id.slice(-6)}) and I love it! Thank you for the great service.`;
    const telegramUrl = `https://t.me/Luna_market1?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = telegramUrl; link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setActiveItemKey(null);
  };

  const handleSendItemFeedback = (order, item) => {
    if (!feedbackText.trim()) return;
    const itemImage = item.imageUrl || item.images?.[0] || '';
    const text = `${itemImage ? itemImage + '\n\n' : ''}📝 *Customer Feedback* 📝\n\n*Item:* ${item.name}\n*Order ID:* ${order.id.slice(-6)}\n\n*Feedback:* ${feedbackText}`;
    const telegramUrl = `https://t.me/Luna_market1?text=${encodeURIComponent(text)}`;
    const link = document.createElement('a');
    link.href = telegramUrl; link.target = '_blank';
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setActiveItemKey(null);
    setFeedbackText('');
  };

  const handleDeleteItem = async (order, itemIdx) => {
    if (!window.confirm("Are you sure you want to remove this item from your order?")) return;
    
    try {
      const newItems = [...order.items];
      newItems.splice(itemIdx, 1);
      
      if (newItems.length === 0) {
        // Delete entire order if empty
        await deleteOrder(order.id);
        setOrders(prev => prev.filter(o => o.id !== order.id));
      } else {
        // Update order with item removed
        const newTotal = newItems.reduce((acc, i) => acc + (Number(i.price) * (i.qty || 1)), 0);
        await updateOrder(order.id, { items: newItems, totalAmount: newTotal, totalPrice: newTotal });
        setOrders(prev => prev.map(o => o.id === order.id ? { ...o, items: newItems, totalAmount: newTotal, totalPrice: newTotal } : o));
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Could not delete item. Please try again.');
    }
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
                  
                  <div className="space-y-4">
                     {order.items?.map((item, idx) => (
                       <div key={idx} className="flex flex-col border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center space-x-3">
                             <div className="relative shrink-0">
                               <img 
                                 src={item.imageUrl || item.images?.[0]} 
                                 alt={item.name} 
                                 className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-80 transition-opacity" 
                                 onClick={() => toggleItemActions(order.id, idx)}
                               />
                               <div className="absolute -bottom-1.5 -right-1.5 bg-black dark:bg-white text-white dark:text-black text-[8px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none">
                                 TAP
                               </div>
                             </div>
                             <div className="flex-1">
                                <h4 className="text-xs font-bold text-black dark:text-white line-clamp-2 pr-2">{item.name}</h4>
                                <p className="text-[10px] text-gray-500 mt-1">Qty: {item.qty} | {item.size} | {item.color}</p>
                             </div>
                             <span className="text-xs font-bold text-black dark:text-white shrink-0">{item.price} ETB</span>
                          </div>
                          
                          {/* Reveal Actions when Photo is Clicked */}
                          {activeItemKey === `${order.id}-${idx}` && (
                            <div className="mt-3 bg-gray-50 dark:bg-[#1a1a1a] p-3 rounded-xl border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                              <div className="flex gap-2 mb-2">
                                <button 
                                  onClick={() => handleSendItemThanks(order, item)}
                                  className="flex-1 bg-gold text-black py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center shadow-sm hover:scale-[1.02] active:scale-95 transition-transform"
                                >
                                  <ThumbsUp className="w-3 h-3 mr-1.5" /> Thanks
                                </button>
                                <button 
                                  onClick={() => handleDeleteItem(order, idx)}
                                  className="flex-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center shadow-sm hover:scale-[1.02] active:scale-95 transition-transform"
                                >
                                  <Trash2 className="w-3 h-3 mr-1.5" /> Delete
                                </button>
                              </div>
                              
                              <div className="relative mt-2">
                                <textarea 
                                  value={feedbackText}
                                  onChange={(e) => setFeedbackText(e.target.value)}
                                  placeholder="Write feedback for this item..."
                                  className="w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 pr-8 text-[11px] text-black dark:text-white outline-none focus:border-gold min-h-[60px] resize-none"
                                />
                                <button 
                                  onClick={() => toggleItemActions(order.id, idx)}
                                  className="absolute top-2.5 right-2.5 text-gray-400 hover:text-black dark:hover:text-white"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <button 
                                onClick={() => handleSendItemFeedback(order, item)}
                                disabled={!feedbackText.trim()}
                                className="w-full mt-2 bg-black dark:bg-white text-white dark:text-black py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest flex justify-center items-center disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-transform shadow-sm"
                              >
                                <Send className="w-3 h-3 mr-1.5" /> Send Feedback
                              </button>
                            </div>
                          )}
                       </div>
                     ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total</span>
                     <span className="text-sm font-bold text-gold">{order.totalPrice || order.items?.reduce((acc, i) => acc + (Number(i.price) * (i.qty || 1)), 0)} ETB</span>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
