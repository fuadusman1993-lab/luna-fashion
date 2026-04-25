import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, LogOut, Settings as SettingsIcon, LogIn, ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';

export default function Me() {
  const { language, cart } = useAppContext();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { getUserOrders } = useOrders();
  
  // Custom SVG for TikTok
  const TikTokIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
       <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
  
  const InstagramIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
    </svg>
  );

  const [chartData, setChartData] = useState([
    { day: 'Mon', value: 5 },
    { day: 'Tue', value: 5 },
    { day: 'Wed', value: 5 },
    { day: 'Thu', value: 5 },
    { day: 'Fri', value: 5 },
    { day: 'Sat', value: 5 },
    { day: 'Sun', value: 5 },
  ]);

  useEffect(() => {
    async function loadActivity() {
      const orders = await getUserOrders();
      const baseData = [
        { day: 'Mon', value: 0 },
        { day: 'Tue', value: 0 },
        { day: 'Wed', value: 0 },
        { day: 'Thu', value: 0 },
        { day: 'Fri', value: 0 },
        { day: 'Sat', value: 0 },
        { day: 'Sun', value: 0 },
      ];
      // Map JS getDay() (0=Sun, 1=Mon) to our array indices (0=Mon, 6=Sun)
      const dayMap = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
      
      orders.forEach(order => {
        if (order.createdAt) {
          const date = new Date(order.createdAt.seconds * 1000);
          const dayIndex = dayMap[date.getDay()];
          baseData[dayIndex].value += 15; // orders bump activity significantly
        }
      });
      // minimum value for aesthetic visual
      baseData.forEach(d => { if (d.value < 5) d.value = 5; });
      setChartData(baseData);
    }
    loadActivity();
  }, [currentUser]);

  const maxVal = Math.max(...chartData.map(d => d.value), 100);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const getUserInitial = () => {
    if (currentUser?.displayName) return currentUser.displayName.charAt(0).toUpperCase();
    if (currentUser?.email) return currentUser.email.charAt(0).toUpperCase();
    return language === 'en' ? 'G' : 'እ'; // G for Guest
  };

  const getDisplayName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'Guest User';
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505] font-sans relative z-40 pb-[90px] w-full flex flex-col">
       
       {/* Sticky Global Header */}
       <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#f5f5f5]/95 dark:bg-[#050505]/95 backdrop-blur-md px-4 py-4 flex items-center justify-between transition-colors duration-300 border-b border-gray-200 dark:border-transparent md:max-w-2xl mx-auto">
         <button onClick={() => navigate(-1)} className="text-black dark:text-white hover:text-[#D4AF37] transition-colors active:scale-95 shrink-0 flex items-center">
           <ArrowLeft strokeWidth={1.5} className="w-[22px] h-[22px]" />
           <span className="ml-2 font-medium text-[15px]">Profile</span>
         </button>
         
         <div className="flex items-center gap-4 text-black dark:text-white shrink-0">
           <button onClick={() => navigate('/search')}><Search className="w-[20px] h-[20px]" strokeWidth={1.5} /></button>
           <button onClick={() => navigate('/cart')} className="relative">
              <ShoppingCart className="w-[20px] h-[20px]" strokeWidth={1.5} />
              {cart && cart.length > 0 && (
                 <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-black shadow-sm">
                    {cart.length}
                 </span>
              )}
           </button>
         </div>
       </div>

       <div className="flex-1 px-3 py-6 md:max-w-2xl mx-auto w-full">
         {/* User Profile Info */}
         <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-4">
             <div className="w-[65px] h-[65px] bg-gradient-to-br from-[#bf953f] to-[#fbf5b7] rounded-full flex flex-col items-center justify-center font-display text-2xl font-bold text-black border-2 border-white dark:border-black shadow-sm shrink-0">
                {getUserInitial()}
             </div>
             <div>
               <h2 className="text-[18px] font-bold text-luna-black dark:text-luna-white tracking-tight">{getDisplayName()}</h2>
               <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
                 {currentUser ? 'Silver Member' : 'Welcome to Luna'}
               </p>
             </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <a href="https://www.tiktok.com/@lunamarket2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-black dark:text-white border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <TikTokIcon />
             </a>
             <a href="https://t.me/luna_market11" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-[20px] text-[#0088cc] border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
                   <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.32.023.467.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.664 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
             </a>
             <a href="https://www.instagram.com/luna_market2" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-pink-600 border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <InstagramIcon />
             </a>
             <Link to="/settings" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-black dark:text-white border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <SettingsIcon className="w-[20px] h-[20px]" />
             </Link>
          </div>
       </div>

       {/* Authentication Status / Action */}
       {!currentUser ? (
         <div className="bg-white dark:bg-[#111111] rounded-2xl p-5 mb-5 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-[14px] text-luna-black dark:text-white tracking-wide mb-2">Sign in to sync your profile</h3>
            <p className="text-[11px] text-gray-500 font-medium mb-4">Access your orders, wishlist, and exclusive offers.</p>
            <Link to="/login" className="bg-[#D4AF37] text-black w-full py-3 rounded-full font-bold uppercase tracking-widest text-[12px] shadow-md hover:scale-[1.02] transition-transform">
               Sign In / Register
            </Link>
         </div>
       ) : (
         <div className="bg-white dark:bg-[#111111] rounded-2xl p-4 mb-5 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={handleLogout}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-200">Sign Out</span>
            </div>
         </div>
       )}

       {/* Business Dashboard Chart */}
       <div className="bg-white dark:bg-[#111111] rounded-2xl p-5 mb-5 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="flex justify-between items-end mb-4">
            <div>
               <h3 className="font-bold text-[14px] text-luna-black dark:text-white tracking-wide">Shopping Activity</h3>
               <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">Weekly Overview</p>
            </div>
            <span className="text-[12px] font-bold text-[#D4AF37]">+14%</span>
         </div>
         <div className="w-full overflow-hidden pt-2">
            <svg viewBox="0 0 300 120" className="w-full h-[120px] overflow-visible">
               {chartData.map((d, i) => {
                 const height = (d.value / maxVal) * 80;
                 const y = 100 - height;
                 const x = i * 42 + 8;
                 return (
                   <g key={d.day}>
                     <rect x={x} y={y} width="24" height={height} rx="4" fill="currentColor" className="text-[#D4AF37] transition-all duration-500 hover:fill-black dark:hover:fill-white cursor-pointer origin-bottom">
                        <animate attributeName="height" from="0" to={height} dur="1s" fill="freeze" />
                        <animate attributeName="y" from="100" to={y} dur="1s" fill="freeze" />
                     </rect>
                     <text x={x + 12} y="115" fontSize="10" fill="currentColor" className="text-gray-400 font-display font-medium" textAnchor="middle">{d.day}</text>
                   </g>
                 )
               })}
            </svg>
         </div>
       </div>

       {/* Orders & Wishlist */}
       <div className="grid grid-cols-2 gap-3 mb-5">
         <Link to="/orders" className="bg-white dark:bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Package className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 tracking-wide">My Orders</span>
         </Link>
         <Link to="/wishlist" className="bg-white dark:bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Heart className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Wishlist</span>
         </Link>
       </div>

       {/* Our Stores Location */}
       <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-4 p-5">
          <h3 className="font-bold text-[14px] text-luna-black dark:text-white tracking-wide mb-4">Our Stores</h3>
          
          <div className="flex flex-col space-y-4">
             <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                   <p className="text-[12px] font-bold text-black dark:text-white mb-1">Jemo Branch</p>
                   <p className="text-[10px] text-gray-500 leading-relaxed">Sun Moon Star Mall<br/>1st Floor, Shop No. 06</p>
                </div>
                <a href="https://maps.google.com/?q=Sun+Moon+Star+Mall+Jemo+Addis+Ababa" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-sm">
                   Get Directions
                </a>
             </div>
             
             <div className="flex justify-between items-center">
                <div>
                   <p className="text-[12px] font-bold text-black dark:text-white mb-1">Bethel Branch</p>
                   <p className="text-[10px] text-gray-500 leading-relaxed">Mira Mall<br/>1st Floor</p>
                </div>
                <a href="https://maps.google.com/?q=Mira+Mall+Bethel+Addis+Ababa" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold uppercase tracking-widest text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-lg hover:scale-105 transition-transform shadow-sm">
                   Get Directions
                </a>
             </div>
          </div>
       </div>

       </div>
    </div>
  );
}
