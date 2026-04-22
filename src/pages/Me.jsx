import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Package, Heart, MapPin, Settings as SettingsIcon } from 'lucide-react';

export default function Me() {
  const { language, t } = useAppContext();

  // Custom SVG for TikTok since Lucide might not have a perfect match
  const TikTokIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-[20px] h-[20px]">
       <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#050505] px-3 py-6 font-sans relative z-40 pb-[90px] md:max-w-2xl mx-auto w-full">
       
       {/* User Profile Header */}
       <div className="flex items-center justify-between mb-6 pt-4 px-2">
          <div className="flex items-center space-x-4">
             <div className="w-[65px] h-[65px] bg-gradient-to-br from-gold to-yellow-600 rounded-full flex flex-col items-center justify-center font-display text-2xl font-bold text-black border-2 border-white dark:border-black shadow-sm shrink-0">
                {language === 'en' ? 'L' : 'ሉ'}
             </div>
             <div>
               <h2 className="text-[18px] font-bold text-luna-black dark:text-luna-white tracking-tight">Luna Guest</h2>
               <p className="text-[11px] text-gray-500 font-medium tracking-wide">Silver Member</p>
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

       {/* Orders Panel */}
       <div className="bg-white dark:bg-[#111111] rounded-xl p-4 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-[14px] text-luna-black dark:text-white">{t('myOrders') || 'My Orders'}</h3>
             <span className="text-[10px] text-gray-400 font-medium">{t('viewAll') || 'View All >'}</span>
         </div>
         <div className="grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center">
               <Package className="w-[20px] h-[20px] mb-1.5 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">{t('unpaid') || 'Unpaid'}</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-[20px] h-[20px] mb-1.5 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">{t('processing') || 'Processing'}</span>
            </div>
            <div className="flex flex-col items-center relative">
               <div className="absolute -top-1 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
               <Package className="w-[20px] h-[20px] mb-1.5 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">{t('shipped') || 'Shipped'}</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-[20px] h-[20px] mb-1.5 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[9px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">{t('returns') || 'Returns'}</span>
            </div>
         </div>
       </div>

       {/* Services Panel */}
       <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">
          
          <button className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               <Heart className="w-4 h-4 mr-3 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
               <span className="font-semibold text-[12px] text-gray-800 dark:text-gray-200">{t('wishlist') || 'Wishlist'}</span>
             </div>
             <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

          <button className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               <MapPin className="w-4 h-4 mr-3 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
               <span className="font-semibold text-[12px] text-gray-800 dark:text-gray-200">{t('address') || 'Address Management'}</span>
             </div>
             <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>

       </div>
    </div>
  );
}
