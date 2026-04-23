import { useEffect, useState } from 'react';
import { ArrowLeft, Package, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';

export default function Orders() {
  const navigate = useNavigate();
  const { getUserOrders, loading } = useOrders();
  const [orders, setOrders] = useState([]);

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
          </div>
        )}
      </div>
    </div>
  );
}
