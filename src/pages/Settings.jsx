import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Globe, Bell, Info, ShieldAlert, ChevronRight, Check } from 'lucide-react';

// Custom Icons for Socials
const TikTokIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
     <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-[16px] h-[16px]">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.869a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" className="w-[18px] h-[18px]">
     <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.32.023.467.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.664 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export default function Settings() {
  const { language, toggleLanguage } = useAppContext();
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
    // Soft security lock for the admin dashboard (PIN: 1234)
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
      
      {/* Header - Back Arrow on Right */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#111111]/95 backdrop-blur-md border-b border-white/5 px-4 py-4 flex items-center justify-between shadow-sm md:max-w-2xl mx-auto">
        <h1 className="text-[17px] font-bold tracking-widest uppercase text-white">Settings</h1>
        <button onClick={() => navigate(-1)} className="text-white hover:text-[#D4AF37] transition-colors active:scale-95 shrink-0">
          <ArrowLeft strokeWidth={1.5} className="w-[22px] h-[22px]" />
        </button>
      </div>

      <div className="px-4 pt-6 pb-10 flex-1 flex flex-col md:max-w-2xl mx-auto w-full space-y-6">
        
        {/* Menu Items */}
        <div className="bg-[#111111] rounded-xl shadow-lg border border-white/5 overflow-hidden">
          {/* Profile */}
          <Link to="/me" className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               <User className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Profile</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </Link>

          {/* Shipping Address */}
          <button className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               <MapPin className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Shipping Address</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>

          {/* Language Toggle */}
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between py-4 px-4 border-b border-white/5 hover:bg-white/5 transition">
             <div className="flex items-center">
               <Globe className="w-[18px] h-[18px] mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-white tracking-wide">Language Options</span>
             </div>
             <div className="flex items-center bg-[#1a1a1a] rounded-full p-1 border border-white/10">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${language === 'en' ? 'bg-[#22c55e] text-black shadow-sm' : 'text-gray-400'}`}>ENG</span>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-colors ${language === 'am' ? 'bg-[#22c55e] text-black shadow-sm' : 'text-gray-400'}`}>አማርኛ</span>
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

        {/* About Us Section */}
        <div className="bg-[#111111] rounded-xl shadow-lg border border-white/5 overflow-hidden p-5">
           <div className="flex items-center mb-3">
              <Info className="w-[18px] h-[18px] mr-2 text-[#D4AF37]" strokeWidth={1.5} />
              <h2 className="font-bold text-[14px] tracking-wide text-white">About Luna Fashion</h2>
           </div>
           <p className="text-[12px] text-gray-400 leading-relaxed font-medium mb-5">
             Welcome to the pinnacle of modest elegance. Luna Fashion redefines contemporary style by blending rich traditions with modern, premium aesthetics. Designed to empower, crafted to perfection.
           </p>
           
           <div className="flex items-center justify-center space-x-4">
              <a href="https://t.me/luna_market11" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-full bg-white text-[#0088cc] flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                 <TelegramIcon />
              </a>
              <a href="https://www.instagram.com/luna_market2" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-full bg-white text-pink-600 flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                 <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@lunamarket2" target="_blank" rel="noopener noreferrer" className="w-[42px] h-[42px] rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-md">
                 <TikTokIcon />
              </a>
           </div>
        </div>

        {/* Admin Access - ONLY VISIBLE IF ADMIN */}
        {isAdmin && (
          <div className="bg-[#111111] rounded-xl shadow-lg border border-red-500/20 overflow-hidden">
            <button onClick={handleAdminClick} className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/5 transition">
               <div className="flex items-center">
                 <ShieldAlert className="w-[18px] h-[18px] mr-3 text-red-500" strokeWidth={1.5} />
                 <span className="font-semibold text-[14px] text-red-500 tracking-wide">Admin Dashboard</span>
               </div>
               <ChevronRight className="w-4 h-4 text-red-500/50" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 pb-4 flex flex-col items-center justify-center opacity-40">
           <h3 className="font-display font-black tracking-[0.3em] text-[16px] text-white mb-1">LUNA</h3>
           <p className="text-[9px] font-bold tracking-widest uppercase text-white mb-1">Version 1.0.0</p>
           <p className="text-[9px] text-white">© {new Date().getFullYear()} Luna Fashion. All Rights Reserved.</p>
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
