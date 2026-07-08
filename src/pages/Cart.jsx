import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Store, MoreHorizontal, ChevronRight, CheckCircle2, Circle, ArrowLeft } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import ProductGrid from '../components/product/ProductGrid';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useAppContext();
  const { products } = useProducts();
  const navigate = useNavigate();

  // State for selected items (array of cartIds)
  const [selectedItems, setSelectedItems] = useState((cart || []).map(item => item.cartId));

  // Group cart items by category (simulate store/shop folders)
  const groupedCart = useMemo(() => {
    return (cart || []).reduce((groups, item) => {
      const storeName = item.category || 'Luna Official';
      if (!groups[storeName]) {
        groups[storeName] = [];
      }
      groups[storeName].push(item);
      return groups;
    }, {});
  }, [cart]);

  const recommendations = products ? products.slice(0, 6) : [];

  // Selection Logic
  const allCartIds = (cart || []).map(item => item.cartId);
  const isAllSelected = (cart?.length || 0) > 0 && selectedItems.length === (cart?.length || 0);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]);
    } else {
      setSelectedItems(allCartIds);
    }
  };

  const toggleStoreSelect = (storeName) => {
    const storeItems = groupedCart[storeName].map(item => item.cartId);
    const allStoreItemsSelected = storeItems.every(id => selectedItems.includes(id));
    
    if (allStoreItemsSelected) {
      setSelectedItems(prev => prev.filter(id => !storeItems.includes(id)));
    } else {
      const newSelections = new Set([...selectedItems, ...storeItems]);
      setSelectedItems(Array.from(newSelections));
    }
  };

  const toggleItemSelect = (cartId) => {
    setSelectedItems(prev => 
      prev.includes(cartId) 
        ? prev.filter(id => id !== cartId)
        : [...prev, cartId]
    );
  };

  // Dynamic Total Calculation
  const selectedCartItems = (cart || []).filter(item => selectedItems.includes(item.cartId));
  const total = selectedCartItems.reduce((sum, item) => sum + Number(item.price) * (item.qty || 1), 0);
  const totalItemsCount = selectedCartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  const { createOrder, loading: orderLoading } = useOrders();

  const handleCheckout = () => {
    if (selectedItems.length === 0) return;
    
    // Generate a quick tracking ID so we don't have to wait for Firestore
    const trackingId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Format Telegram Message
    let text = "";
    
    // Add first item's image to trigger preview
    if (selectedCartItems.length > 0) {
      const firstItem = selectedCartItems[0];
      const firstImage = firstItem.image || firstItem.imageUrl || (firstItem.images && firstItem.images[0]) || '';
      if (firstImage) {
        text += `${firstImage}\n\n`;
      }
    }

    text += "✨ *Luna Fashion Order Request* ✨\n\n";
    text += `*Order ID:* ${trackingId}\n\n`; // Add Tracking ID
    selectedCartItems.forEach(item => {
      const qty = item.qty || 1;
      text += `🛍️ *${item.name}*\n`;
      text += `   ↳ Variant: ${item.size} / ${item.color}\n`;
      text += `   ↳ Qty: ${qty} x ${Number(item.price).toLocaleString()} ETB\n`;
      text += `   ↳ Subtotal: ${(Number(item.price) * qty).toLocaleString()} ETB\n\n`;
    });
    text += `💳 *Final Total: ${total.toLocaleString()} ETB*\n`;
    text += "📍 Shipping to: Ethiopia\n\n";
    text += "Is this available to order?";
    
    // 2. Open Telegram Immediately (Fixes slowness and popup blocker issues)
    const encodedText = encodeURIComponent(text);
    const telegramUrl = `https://t.me/Luna_market1?text=${encodedText}`;
    
    // Using anchor click for better PWA compatibility
    const link = document.createElement('a');
    link.href = telegramUrl;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // 3. Create Order in Firestore in the background
    try {
      const orderPayload = {
        items: selectedCartItems,
        totalAmount: total,
        totalItemsCount,
        contactPhone: 'guest-no-phone',
        shippingDestination: 'Ethiopia',
        trackingId
      };
      
      createOrder(orderPayload).catch(err => {
        console.error('Failed to create background order', err);
      });
      
    } catch (err) {
      console.error('Checkout error', err);
    }
  };

  // Helper for Custom Circle Checkbox
  const CustomCheckbox = ({ isChecked, onClick }) => (
    <button onClick={onClick} className="shrink-0 p-1 flex items-center justify-center transition-transform active:scale-90">
      {isChecked ? (
        <CheckCircle2 className="w-5 h-5 text-black dark:text-white transition-colors duration-200" fill="currentColor" strokeWidth={1} />
      ) : (
        <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 transition-colors duration-200" strokeWidth={1.5} />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505] pb-[160px] flex flex-col relative w-full overflow-x-hidden">
      
      {/* Top Header - Exact SHEIN Match */}
      <div className="sticky top-0 left-0 right-0 w-full bg-white dark:bg-[#0a0a0a] z-50 shadow-sm border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center justify-between px-3 h-[44px]">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="hidden md:flex p-1 mr-1 text-black dark:text-white hover:text-gold active:scale-95 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <CustomCheckbox isChecked={isAllSelected} onClick={toggleSelectAll} />
            <span className="text-[14px] font-bold text-black dark:text-white">All</span>
            <span className="text-[14px] font-medium text-gray-500 ml-1">Cart({cart?.length || 0})</span>
            <div className="flex items-center text-[10px] text-gray-500 ml-1">
              <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Ship to Ethiopia
            </div>
          </div>
          <button className="p-1">
            <MoreHorizontal className="w-5 h-5 text-black dark:text-white" />
          </button>
        </div>
      </div>

      <div className="flex-1 md:max-w-6xl md:mx-auto w-full mt-2 md:grid md:grid-cols-3 md:gap-8 px-0 md:px-4 items-start">
        <div className="md:col-span-2">
        {(cart?.length || 0) === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
             <h2 className="text-lg font-bold text-black dark:text-white mb-2">Your cart is empty</h2>
             <button onClick={() => navigate('/shop')} className="bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider py-3 px-8 text-xs rounded-full shadow-md mt-4">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-2 mt-2 px-2">
            {Object.entries(groupedCart).map(([storeName, items]) => {
              const storeItems = items.map(i => i.cartId);
              const isStoreSelected = storeItems.every(id => selectedItems.includes(id));
              
              return (
                <div key={storeName} className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden shadow-sm pt-2 pb-4">
                  
                  {/* Store Header */}
                  <div className="flex items-center px-3 py-2">
                    <CustomCheckbox isChecked={isStoreSelected} onClick={() => toggleStoreSelect(storeName)} />
                    <Store className="w-4 h-4 text-black dark:text-white ml-1 mr-2" />
                    <span className="text-[14px] font-bold text-black dark:text-white tracking-wide">{storeName}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-1" />
                  </div>

                  {/* Store Items */}
                  <div className="space-y-4 mt-2">
                    {items.map((item) => {
                      const isItemSelected = selectedItems.includes(item.cartId);
                      const originalPrice = Number(item.price) * 1.25; // Mock original price for reference UI
                      
                      return (
                        <div key={item.cartId} className="flex px-3 items-start gap-2">
                          
                          <div className="pt-8 shrink-0">
                            <CustomCheckbox isChecked={isItemSelected} onClick={() => toggleItemSelect(item.cartId)} />
                          </div>
                          
                          <Link to={`/product/${item.id}`} state={{ product: item }} className="shrink-0">
                            <img 
                              src={item.image || item.imageUrl || (item.images && item.images[0])} 
                              alt={item.name} 
                              className="w-16 h-16 aspect-square object-cover rounded-md shadow-sm border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-[#222] transition-opacity duration-300" 
                              loading="lazy"
                            />
                          </Link>
                          
                          <div className="flex-1 flex flex-col justify-between pt-1 relative">
                            {/* Title & Trash */}
                            <div className="flex justify-between items-start gap-2">
                              <Link to={`/product/${item.id}`} state={{ product: item }} className="text-[12px] font-medium text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 pr-6 hover:underline">
                                {item.name}
                              </Link>
                              <button onClick={() => removeFromCart(item.cartId)} className="absolute right-0 top-0 p-1 text-gray-400 hover:text-red-500">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Variant */}
                            <div className="mt-1 flex items-center bg-gray-50 dark:bg-[#1a1a1a] rounded px-1.5 py-0.5 w-max max-w-full">
                               <span className="text-[10px] text-gray-500 whitespace-normal break-words line-clamp-2">{item.color} / {item.size} <ChevronRight className="w-3 h-3 inline text-gray-400" /></span>
                            </div>

                            {/* Pricing and Action Row */}
                            <div className="mt-3 relative">
                              <div className="flex items-center flex-wrap gap-1.5">
                                <span className="font-bold text-[16px] text-[#f2603f] dark:text-[#f87171] tracking-tight">
                                  {Number(item.price).toLocaleString()} <span className="text-[10px]">ETB</span>
                                </span>
                                <span className="text-[11px] text-gray-400 line-through">
                                  {originalPrice.toLocaleString()} ETB
                                </span>
                                <span className="text-[10px] font-bold text-[#f2603f] dark:text-[#f87171] bg-[#fdf0ed] dark:bg-[#4a201b] px-1 rounded flex items-center">
                                  -25% <ChevronRight className="w-2.5 h-2.5 inline" />
                                </span>
                              </div>
                              
                              <div className="text-[10px] font-bold text-[#da8a36] mt-0.5">
                                Lowest in all sellers
                              </div>
                              
                              {/* Dropdown-style Quantity Selector */}
                              <div className="absolute right-0 bottom-0">
                                 <div className="relative border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-[#111] overflow-hidden group hover:border-gray-300 transition-colors">
                                    <select 
                                      value={item.qty || 1}
                                      onChange={(e) => updateQuantity(item.cartId, Number(e.target.value) - (item.qty || 1))}
                                      className="appearance-none bg-transparent pl-3 pr-6 py-1 text-[12px] font-bold text-black dark:text-white outline-none cursor-pointer w-[55px]"
                                    >
                                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                        <option key={n} value={n} className="text-black bg-white">{n}</option>
                                      ))}
                                    </select>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                      <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                 </div>
                              </div>

                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 'You Might Like' Section */}
        <div className="mt-6 mb-6 bg-white dark:bg-[#0a0a0a] pt-4">
          <div className="flex items-center justify-center mb-4 gap-2">
            <div className="w-2 h-2 rotate-45 bg-gray-300 dark:bg-gray-700"></div>
            <h3 className="text-[14px] font-bold text-black dark:text-white">
              You Might Like to Fill it With
            </h3>
            <div className="w-2 h-2 rotate-45 bg-gray-300 dark:bg-gray-700"></div>
          </div>

          <div className="-mx-1">
             <ProductGrid products={recommendations} />
          </div>
        </div>
        </div> {/* End of Left Column */}

        {/* Right Column: Order Summary (Desktop Only) */}
        {(cart?.length || 0) > 0 && (
          <div className="hidden md:block md:col-span-1 sticky top-[120px] bg-white dark:bg-[#111111] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-serif font-bold italic mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({totalItemsCount} items)</span>
                <span>{total.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-gray-100 dark:border-white/10 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-gold">{total.toLocaleString()} ETB</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="w-full bg-[#D4AF37] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black text-black h-12 rounded-full font-bold uppercase tracking-widest text-[13px] flex items-center justify-center disabled:opacity-50 transition-colors shadow-md"
            >
              Checkout Now
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Secure checkout provided by Telegram
            </p>
          </div>
        )}

      </div>

      {/* Fixed Checkout Bar - Mobile Only */}
      {(cart?.length || 0) > 0 && (
        <div className="md:hidden fixed bottom-[85px] left-0 right-0 w-full z-40 px-4 flex justify-center pointer-events-none">
          <div className="bg-black dark:bg-[#1a1a1a] dark:border dark:border-white/10 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)] w-full max-w-md rounded-xl flex items-center justify-between pointer-events-auto">
            
            <div className="flex flex-col justify-center text-white">
              <div className="flex items-baseline">
                <span className="text-[12px] font-bold text-gray-400 mr-1.5 uppercase tracking-wider">Total:</span>
                <span className="font-bold text-[20px] text-[#D4AF37] leading-none tracking-tight">
                  {total.toLocaleString()} <span className="text-[11px] font-normal text-[#D4AF37]">ETB</span>
                </span>
              </div>
              {total > 0 && (
                <div className="text-[10px] text-gray-500 mt-0.5 tracking-wide">Saved {Math.floor(total * 0.25).toLocaleString()} ETB</div>
              )}
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="bg-[#D4AF37] dark:bg-white text-black px-8 h-[46px] rounded font-bold uppercase tracking-widest text-[13px] flex items-center justify-center disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-500 shadow-md active:scale-95 transition-transform"
            >
              Checkout{totalItemsCount > 0 ? ` (${totalItemsCount})` : ''}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
