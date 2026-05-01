import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

// Safe icon renderer to prevent crashes if an icon doesn't exist
const SafeIcon = ({ name, ...props }) => {
  const Comp = LucideIcons[name];
  return Comp ? <Comp {...props} /> : <span className="w-4 h-4 inline-block bg-gray-200 rounded-full"></span>;
};

export default function Settings() {
  const appContext = useAppContext() || {};
  const { 
    language = 'en', 
    toggleLanguage = () => {}, 
    theme = 'dark', 
    toggleTheme = () => {}, 
    cart = [], 
    setToastMessage 
  } = appContext;

  const authContext = useAuth() || {};
  const { isAdmin = false, adminPin = '1234' } = authContext;
  
  const navigate = useNavigate();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try {
      return localStorage.getItem('luna_notifications') !== 'false';
    } catch (e) {
      return true;
    }
  });
  
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Sync notifications setting
  useEffect(() => {
    try {
      localStorage.setItem('luna_notifications', notificationsEnabled);
    } catch (e) {
      console.error(e);
    }
  }, [notificationsEnabled]);

  const handleAdminClick = () => {
    setShowPinModal(true);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (pinInput === adminPin) {
      setShowPinModal(false);
      navigate('/admin');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handlePinChange = (e) => {
    const val = (e.target.value || '').replace(/\D/g, '').slice(0, 4);
    setPinInput(val);
    if (val.length === 4) setPinError(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-gray-50 dark:bg-[#0a0a0a] text-black dark:text-white flex flex-col font-sans overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden transition-colors duration-300" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 bg-gray-50/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md px-4 py-4 flex items-center justify-between md:max-w-2xl mx-auto transition-colors duration-300 border-b border-gray-200 dark:border-transparent">
        <button onClick={() => navigate(-1)} className="text-black dark:text-white hover:text-[#D4AF37] transition-colors active:scale-95 shrink-0 flex items-center">
          <SafeIcon name="ArrowLeft" strokeWidth={1.5} className="w-[22px] h-[22px]" />
          <span className="ml-2 font-medium text-[15px]">Settings</span>
        </button>
        
        <div className="flex items-center gap-4 text-black dark:text-white shrink-0">
          <button onClick={() => navigate('/search')}><SafeIcon name="Search" className="w-[20px] h-[20px]" strokeWidth={1.5} /></button>
          <button onClick={() => navigate('/cart')} className="relative">
             <SafeIcon name="ShoppingCart" className="w-[20px] h-[20px]" strokeWidth={1.5} />
             {Array.isArray(cart) && cart.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white dark:border-black shadow-sm">
                   {cart.length}
                </span>
             )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:max-w-2xl mx-auto w-full">
        
        {/* SETTINGS LIST */}
        <div className="bg-white dark:bg-[#111111] flex flex-col border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
          {/* Admin Panel */}
          {isAdmin && (
            <button onClick={handleAdminClick} className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
               <div className="flex items-center">
                 <SafeIcon name="Lock" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
                 <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Admin Panel</span>
               </div>
               <SafeIcon name="ChevronRight" className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          )}

          {/* Profile */}
          <Link to="/me" className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name="User" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Profile Management</span>
             </div>
             <SafeIcon name="ChevronRight" className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </Link>

          {/* Shipping Address */}
          <button onClick={() => setToastMessage && setToastMessage("Currently shipping within Ethiopia only")} className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name="MapPin" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Shipping address</span>
             </div>
             <div className="flex items-center">
                <span className="text-[16px]">🇪🇹</span>
                <SafeIcon name="ChevronRight" className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2" />
             </div>
          </button>
          
          {/* Currency */}
          <button onClick={() => setToastMessage && setToastMessage("Pricing is fixed in ETB")} className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name="DollarSign" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Currency</span>
             </div>
             <div className="flex items-center">
                <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 mr-2 uppercase tracking-widest">ETB</span>
                <SafeIcon name="ChevronRight" className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-2" />
             </div>
          </button>

          {/* Language Options */}
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name="Globe" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Language Selection</span>
             </div>
             <div className="flex items-center bg-gray-100 dark:bg-[#1a1a1a] rounded-full p-1 border border-gray-200 dark:border-white/10 transition-colors duration-300">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-[#22c55e] text-black shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>ENG</span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${language === 'am' ? 'bg-[#22c55e] text-black shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>አማርኛ</span>
             </div>
          </button>

          {/* Display Mode Toggle */}
          <button onClick={toggleTheme} className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name={theme === 'dark' ? 'Moon' : 'Sun'} className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Display Mode</span>
             </div>
             <div className="flex items-center">
                <span className="text-[12px] font-bold text-gray-400 mr-3 uppercase">{theme}</span>
                <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#22c55e]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${theme === 'dark' ? 'left-[26px]' : 'left-1'}`}></div>
                </div>
             </div>
          </button>

          {/* Notifications Toggle */}
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name="Bell" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Push Notifications</span>
             </div>
             <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-[#22c55e]' : 'bg-gray-300 dark:bg-gray-700'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${notificationsEnabled ? 'left-[26px]' : 'left-1'}`}></div>
             </div>
          </button>

          {/* About Us */}
          <Link to="/about" className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <span className="w-[18px] h-[18px] mr-3 flex items-center justify-center font-serif italic text-[#D4AF37] font-bold text-lg">i</span>
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">About Us</span>
             </div>
             <SafeIcon name="ChevronRight" className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </Link>

          {/* Privacy & Terms */}
          <Link to="/privacy" className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 dark:hover:bg-white/5 transition">
             <div className="flex items-center">
               <SafeIcon name="Shield" className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-black dark:text-white tracking-wide">Privacy & Terms</span>
             </div>
             <SafeIcon name="ChevronRight" className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[40px]"></div>

        {/* Footer */}
        <div className="py-12 flex flex-col items-center justify-center transition-colors duration-300 mt-auto">
           <div className="flex items-center justify-center mb-6">
             <img src="/logo.png" alt="Luna Logo" className="h-[55px] w-auto object-contain drop-shadow-md" />
             <span className="font-serif italic font-bold text-[28px] tracking-wide ml-3 text-black dark:text-white">Luna Fashion</span>
           </div>
           <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500 mb-1">Version 1.0.0</p>
           <p className="text-[10px] text-gray-400 dark:text-gray-500">© 2010-{new Date().getFullYear()} Luna Fashion.</p>
           <p className="text-[10px] text-gray-400 dark:text-gray-500">All rights reserved.</p>
        </div>

      </div>

      {/* PIN Lock Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[20000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setShowPinModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div className="flex flex-col items-center text-center">
               <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                  <SafeIcon name="ShieldAlert" className="w-6 h-6 text-red-500" strokeWidth={1.5} />
               </div>
               <h3 className="text-[18px] font-bold text-white mb-1 tracking-wide">Security Lock</h3>
               <p className="text-[11px] text-gray-400 font-medium mb-6">Please enter your 4-digit Admin PIN to proceed.</p>
               
               <div className="w-full space-y-4">
                 <input 
                   type="password" 
                   maxLength={4}
                   autoFocus
                   value={pinInput}
                   onChange={handlePinChange}
                   placeholder="• • • •"
                   className={`w-full bg-[#0a0a0a] border ${pinError ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-4 text-center text-[24px] font-bold tracking-[1em] text-white outline-none focus:border-[#D4AF37] transition-colors`}
                 />
                 
                 {pinError && <p className="text-red-500 text-[10px] font-bold tracking-wide uppercase">Incorrect PIN</p>}
                 
                 <button 
                   onClick={handlePinSubmit}
                   disabled={pinInput.length < 4}
                   className="w-full bg-[#D4AF37] disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold uppercase tracking-widest text-[12px] py-4 rounded-xl shadow-md hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center"
                 >
                   {pinInput.length === 4 ? 'Verify Access' : 'Enter PIN'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

