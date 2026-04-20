import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Settings, Shield, Package, Heart, Tag, Globe, Moon, Sun, MapPin, CreditCard, ChevronRight, Store, Send, PhoneCall, Map } from 'lucide-react';

export default function Me() {
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();

  return (
    <div className="min-h-[90vh] bg-[#f5f5f5] dark:bg-[#0a0a0a] px-3 py-6 font-sans">
       {/* User Profile Header */}
       <div className="flex items-center space-x-4 mb-8 pt-4 px-2">
          <div className="w-[72px] h-[72px] bg-gradient-to-br from-gold to-yellow-600 rounded-full flex flex-col items-center justify-center font-display text-3xl font-bold text-black border-2 border-white dark:border-black shadow-md">
             {language === 'en' ? 'L' : 'ሉ'}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-luna-black dark:text-luna-white tracking-tight">Luna Guest</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wide">Silver Member</p>
          </div>
       </div>

       {/* Orders Panel */}
       <div className="bg-white dark:bg-[#1a1a1a] rounded-xl p-5 mb-4 shadow-sm border border-gray-100 dark:border-gray-800">
         <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-[15px] text-luna-black dark:text-white">My Orders</h3>
             <span className="text-[11px] text-gray-400 font-medium">View All &gt;</span>
         </div>
         <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
               <Package className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Unpaid</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Processing</span>
            </div>
            <div className="flex flex-col items-center relative">
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div>
               <Package className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Shipped</span>
            </div>
            <div className="flex flex-col items-center">
               <Package className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400 tracking-tight">Returns</span>
            </div>
         </div>
       </div>

       {/* Utilities / Services */}
       <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-4">
          <h3 className="font-bold text-[15px] text-luna-black dark:text-white pt-5 px-5 mb-2">My Services</h3>
          <div className="grid grid-cols-4 gap-4 text-center pb-5 pt-2 px-2">
             <div className="flex flex-col items-center">
               <Heart className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Wishlist</span>
             </div>
             <div className="flex flex-col items-center">
               <Tag className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Coupons</span>
             </div>
             <div className="flex flex-col items-center">
               <CreditCard className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Payment</span>
             </div>
             <div className="flex flex-col items-center">
               <MapPin className="w-[22px] h-[22px] mb-2 text-gray-700 dark:text-gray-300 stroke-[1.5]" />
               <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Address</span>
             </div>
          </div>
       </div>

       {/* Our Locations Panel */}
       <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-4 p-5">
          <div className="flex items-center mb-4 text-luna-black dark:text-white">
             <Store className="w-5 h-5 mr-2 text-gold" />
             <h3 className="font-bold text-[15px]">Our Locations</h3>
          </div>
          
          <div className="space-y-4">
             {/* Branch 1 */}
             <div className="bg-gray-50 dark:bg-[#111111] p-3 rounded-lg border border-gray-100 dark:border-white/5">
                <h4 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-1">Branch 1: Jemo</h4>
                <p className="text-[11px] text-gray-500 font-light mb-2">Jemo 1, Sun Moon Star Mall, 1st Floor, No. 06.</p>
                <button className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] hover:opacity-80 active:scale-95 transition-all">
                   <Map className="w-3 h-3 mr-1" /> View on Map
                </button>
             </div>
             
             {/* Branch 2 */}
             <div className="bg-gray-50 dark:bg-[#111111] p-3 rounded-lg border border-gray-100 dark:border-white/5">
                <h4 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-1">Branch 2: Bethel</h4>
                <p className="text-[11px] text-gray-500 font-light mb-2">Bethel, Mira Mall, 1st Floor.</p>
                <button className="flex items-center text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] hover:opacity-80 active:scale-95 transition-all">
                   <Map className="w-3 h-3 mr-1" /> View on Map
                </button>
             </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
             <div className="flex items-center text-[11px] font-medium text-gray-700 dark:text-gray-300">
                <PhoneCall className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                0977799797
             </div>
             <a href="https://t.me/Luna_market1" target="_blank" rel="noreferrer" className="flex items-center text-[11px] font-medium text-blue-500 hover:text-blue-400 transition-colors">
                <Send className="w-3.5 h-3.5 mr-1.5" />
                @Luna_market1
             </a>
          </div>
       </div>

       {/* Settings & Admin Panel controls */}
       <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
          
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between py-4 px-5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               <Globe className="w-5 h-5 mr-3 text-gold" />
               <span className="font-semibold text-[13px] text-gray-800 dark:text-gray-200">Language (ቋንቋ)</span>
             </div>
             <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">{language === 'en' ? 'English' : 'አማርኛ'}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
             </div>
          </button>

          <button onClick={toggleTheme} className="w-full flex items-center justify-between py-4 px-5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               {theme === 'dark' ? <Moon className="w-5 h-5 mr-3 text-indigo-400" /> : <Sun className="w-5 h-5 mr-3 text-orange-400" />}
               <span className="font-semibold text-[13px] text-gray-800 dark:text-gray-200">Appearance</span>
             </div>
             <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-2">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
             </div>
          </button>

          <Link to="/about" className="flex items-center py-4 px-5 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center justify-between w-full">
               <div className="flex items-center">
                 <Shield className="w-5 h-5 mr-3 text-gray-500" />
                 <span className="font-semibold text-[13px] text-gray-800 dark:text-gray-200">About Luna Fashion</span>
               </div>
               <ChevronRight className="w-4 h-4 text-gray-400" />
             </div>
          </Link>
          
          <Link to="/admin" className="flex items-center justify-between py-4 px-5 bg-[#faf8f0] dark:bg-[#1f1a0d] hover:brightness-95 transition">
             <div className="flex items-center">
               <Settings className="w-5 h-5 mr-3 text-gold" />
               <span className="font-bold text-[13px] text-yellow-800 dark:text-gold tracking-wide">Owner / Admin Setup</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gold/50" />
          </Link>
       </div>
    </div>
  );
}
