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


    </div>
  );
}
