import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, LogOut, Settings as SettingsIcon, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function Me() {
  const { language } = useAppContext();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  // Custom SVG for TikTok
  const TikTokIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
       <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  const chartData = [
    { day: 'Mon', value: 20 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 30 },
    { day: 'Thu', value: 80 },
    { day: 'Fri', value: 65 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 50 },
  ];
  const maxVal = Math.max(...chartData.map(d => d.value));

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
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505] px-3 py-6 font-sans relative z-40 pb-[90px] md:max-w-2xl mx-auto w-full">
       
       {/* User Profile Header */}
       <div className="flex items-center justify-between mb-8 pt-4 px-2">
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
             <a href="https://www.tiktok.com/@lunamarket2?_r=1&_t=ZS-95fxiBRtXYz" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-black dark:text-white border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <TikTokIcon />
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
         <div className="bg-white dark:bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Package className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 tracking-wide">My Orders</span>
         </div>
         <div className="bg-white dark:bg-[#111111] rounded-2xl p-4 flex flex-col justify-center items-center shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Heart className="w-6 h-6 mb-2 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
            <span className="text-[12px] font-semibold text-gray-800 dark:text-gray-200 tracking-wide">Wishlist</span>
         </div>
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
  );
}
