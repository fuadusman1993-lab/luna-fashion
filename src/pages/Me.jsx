import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, Settings as SettingsIcon, Save } from 'lucide-react';
import { useState } from 'react';

export default function Me() {
  const { language, t } = useAppContext();
  const [addressSaved, setAddressSaved] = useState(false);

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

  const handleSaveAddress = () => {
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505] px-3 py-6 font-sans relative z-40 pb-[90px] md:max-w-2xl mx-auto w-full">
       
       {/* User Profile Header */}
       <div className="flex items-center justify-between mb-8 pt-4 px-2">
          <div className="flex items-center space-x-4">
             <div className="w-[65px] h-[65px] bg-gradient-to-br from-[#bf953f] to-[#fbf5b7] rounded-full flex flex-col items-center justify-center font-display text-2xl font-bold text-black border-2 border-white dark:border-black shadow-sm shrink-0">
                {language === 'en' ? 'L' : 'ሉ'}
             </div>
             <div>
               <h2 className="text-[18px] font-bold text-luna-black dark:text-luna-white tracking-tight">Luna Guest</h2>
               <p className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">Silver Member</p>
             </div>
          </div>
          
          <div className="flex items-center space-x-3">
             <a href="https://www.tiktok.com/@lunafashion" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-black dark:text-white border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <TikTokIcon />
             </a>
             <Link to="/settings" className="w-10 h-10 rounded-full bg-white dark:bg-[#111] flex items-center justify-center shadow-sm text-black dark:text-white border border-gray-100 dark:border-gray-800 hover:scale-105 transition-transform">
                <SettingsIcon className="w-[20px] h-[20px]" />
             </Link>
          </div>
       </div>

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

       {/* Address & Map Integration */}
       <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
             <div className="flex items-center">
               <MapPin className="w-5 h-5 mr-3 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
               <span className="font-semibold text-[13px] text-gray-800 dark:text-gray-200 tracking-wide">Delivery Address</span>
             </div>
             <button onClick={handleSaveAddress} className="flex items-center text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] hover:text-black dark:hover:text-white transition-colors bg-[#D4AF37]/10 px-3 py-1.5 rounded-full">
                {addressSaved ? 'Saved!' : 'Save'}
             </button>
          </div>
          <div className="w-full h-[180px] bg-gray-200 relative">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.02028974562!2d38.61332804027495!3d8.963479542403238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
               width="100%" 
               height="100%" 
               style={{border:0}} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="grayscale contrast-125 dark:invert dark:hue-rotate-180"
             ></iframe>
             <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-lg">
                <p className="text-[11px] font-semibold text-black dark:text-white mb-0.5">Addis Ababa, Ethiopia</p>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider">Tap map to pin exact location</p>
             </div>
          </div>
       </div>

    </div>
  );
}
