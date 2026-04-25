import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Globe, Bell, Info, ShieldAlert, ChevronRight, Lock, Moon, Sun, Shield } from 'lucide-react';

export default function Settings() {
  const { language, toggleLanguage, theme, toggleTheme } = useAppContext();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const handleAdminClick = () => {
    setShowPinModal(true);
    setPinInput('');
    setPinError(false);
  };

  const handlePinSubmit = () => {
    if (pinInput === '1234') {
      setShowPinModal(false);
      navigate('/admin');
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPinInput(val);
    if (val.length === 4) setPinError(false);
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0a0a0a] text-white flex flex-col font-sans overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Header - Back Arrow on Left */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md px-4 py-4 flex items-center justify-start md:max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-white hover:text-[#D4AF37] transition-colors active:scale-95 shrink-0 flex items-center">
          <ArrowLeft strokeWidth={1.5} className="w-[22px] h-[22px]" />
          <span className="ml-2 font-medium text-[15px]">Settings</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:max-w-2xl mx-auto w-full">
        
        {/* GROUP 1: Admin, Profile, Shipping */}
        <div className="bg-[#111111] flex flex-col border-y border-white/5">
          {/* Admin Panel - ONLY VISIBLE IF ADMIN */}
          {isAdmin && (
            <button onClick={handleAdminClick} className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
               <div className="flex items-center">
                 <Lock className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
                 <span className="font-semibold text-[14px] text-white tracking-wide">Admin Panel</span>
               </div>
               <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          )}

          {/* Profile */}
          <Link to="/me" className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               <User className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Profile Management</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>

          {/* Shipping Address */}
          <button className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/5 transition">
             <div className="flex items-center">
               <MapPin className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Shipping address</span>
             </div>
             <div className="flex items-center">
                <span className="text-[12px] font-bold text-white mr-2">ETB</span>
                <span className="text-[16px]">🇪🇹</span>
                <ChevronRight className="w-4 h-4 text-gray-500 ml-2" />
             </div>
          </button>
        </div>

        {/* Thick Divider */}
        <div className="h-[10px] bg-[#0a0a0a] w-full"></div>

        {/* GROUP 2: App Settings */}
        <div className="bg-[#111111] flex flex-col border-y border-white/5">
          {/* Language Options */}
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               <Globe className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Language Selection</span>
             </div>
             <div className="flex items-center bg-[#1a1a1a] rounded-full p-1 border border-white/10">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-[#22c55e] text-black shadow-sm' : 'text-gray-400'}`}>ENG</span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${language === 'am' ? 'bg-[#22c55e] text-black shadow-sm' : 'text-gray-400'}`}>አማርኛ</span>
             </div>
          </button>

          {/* Display Mode Toggle */}
          <button onClick={toggleTheme} className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               {theme === 'dark' ? (
                  <Moon className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               ) : (
                  <Sun className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               )}
               <span className="font-semibold text-[14px] text-white tracking-wide">Display Mode</span>
             </div>
             <div className="flex items-center">
                <span className="text-[12px] font-bold text-gray-400 mr-3 uppercase">{theme}</span>
                <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${theme === 'dark' ? 'bg-[#22c55e]' : 'bg-gray-700'}`}>
                   <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${theme === 'dark' ? 'left-[26px]' : 'left-1'}`}></div>
                </div>
             </div>
          </button>

          {/* Notifications Toggle */}
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/5 transition">
             <div className="flex items-center">
               <Bell className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Push Notifications</span>
             </div>
             <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${notificationsEnabled ? 'bg-[#22c55e]' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm ${notificationsEnabled ? 'left-[26px]' : 'left-1'}`}></div>
             </div>
          </button>
        </div>

        {/* Thick Divider */}
        <div className="h-[10px] bg-[#0a0a0a] w-full"></div>

        {/* GROUP 3: Pages */}
        <div className="bg-[#111111] flex flex-col border-y border-white/5">
          {/* About Us */}
          <Link to="/about" className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               <Info className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">About Us</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>

          {/* Privacy & Terms */}
          <Link to="/privacy" className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/5 transition">
             <div className="flex items-center">
               <Shield className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Privacy & Terms</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>
        </div>

        {/* Spacer before footer */}
        <div className="flex-1 bg-[#0a0a0a] min-h-[40px]"></div>

        {/* Premium Gold Footer */}
        <div className="py-10 flex flex-col items-center justify-center bg-[#111111] border-t border-white/5">
           <h3 className="font-display font-black tracking-[0.3em] text-[24px] text-[#D4AF37] mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">LUNA</h3>
           <p className="text-[9px] font-bold tracking-widest uppercase text-gray-500 mb-1">Version 1.0.0</p>
           <p className="text-[9px] text-gray-500">© 2010-{new Date().getFullYear()} Luna Fashion.</p>
           <p className="text-[9px] text-gray-500">All rights reserved.</p>
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
                  <ShieldAlert className="w-6 h-6 text-red-500" strokeWidth={1.5} />
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
