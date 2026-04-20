import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('phone'); // phone or email

  const handleFakeLogin = (e) => {
    e.preventDefault();
    navigate('/me');
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col font-sans pb-[80px]">
      {/* Header */}
      <div className="w-full bg-[#0a0a0a] border-b border-white/5 mx-auto px-4 py-4 flex items-center justify-between sm:max-w-[480px]">
        <button onClick={() => navigate(-1)} className="p-1 hover:text-gold transition-colors active:scale-95">
          <ArrowLeft strokeWidth={2} className="w-6 h-6" />
        </button>
        <span className="text-[12px] font-bold uppercase tracking-widest text-gold cursor-pointer">Support</span>
      </div>

      <div className="flex-1 px-6 pt-10 pb-8 flex flex-col max-w-[480px] w-full mx-auto">
        <h1 className="text-[28px] font-black leading-tight tracking-tight mb-2 uppercase font-display drop-shadow-md text-center">
            Welcome To <span className="text-gold">Luna</span>
        </h1>
        <p className="text-[12px] text-gray-500 font-light mb-8 text-center uppercase tracking-widest">Sign in to access premium collections</p>

        {/* Form Toggles */}
        <div className="flex w-full mb-8 bg-[#111111] p-1 rounded-full shadow-inner border border-white/5">
          <button 
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${loginMethod === 'phone' ? 'bg-[#222] text-gold shadow-md' : 'text-gray-500 hover:text-gray-400'}`}
          >
            Phone Number
          </button>
          <button 
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-widest rounded-full transition-all ${loginMethod === 'email' ? 'bg-[#222] text-gold shadow-md' : 'text-gray-500 hover:text-gray-400'}`}
          >
            Email Address
          </button>
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleFakeLogin} className="flex flex-col space-y-5 flex-1">
          {loginMethod === 'phone' ? (
            <div className="relative flex items-center bg-[#111111] border border-white/10 rounded-xl focus-within:border-gold transition-colors">
              <Phone className="w-5 h-5 text-gray-500 absolute left-4" strokeWidth={1.5} />
              <span className="absolute left-12 text-white font-medium text-[13px] border-r border-white/10 pr-3">+251</span>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full bg-transparent outline-none text-white text-[14px] py-4 pl-28 pr-4 placeholder:text-gray-600 font-light"
                required
              />
            </div>
          ) : (
            <div className="relative flex items-center bg-[#111111] border border-white/10 rounded-xl focus-within:border-gold transition-colors">
              <Mail className="w-5 h-5 text-gray-500 absolute left-4" strokeWidth={1.5} />
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent outline-none text-white text-[14px] py-4 pl-12 pr-4 placeholder:text-gray-600 font-light"
                required
              />
            </div>
          )}

          <div className="relative flex items-center bg-[#111111] border border-white/10 rounded-xl focus-within:border-gold transition-colors">
            <Lock className="w-5 h-5 text-gray-500 absolute left-4" strokeWidth={1.5} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent outline-none text-white text-[14px] py-4 pl-12 pr-4 placeholder:text-gray-600 font-light"
              required
            />
          </div>
          
          <div className="flex justify-end pt-1">
             <span className="text-[10px] text-gray-500 hover:text-gold uppercase tracking-wider font-semibold cursor-pointer transition-colors">Forgot Password?</span>
          </div>

          <div className="pt-4 mt-auto">
            <button 
              type="submit"
              className="w-full bg-[#D4AF37] text-black h-[54px] rounded-full font-bold uppercase tracking-widest flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95 hover:scale-[1.02]"
            >
              Sign In Securely
            </button>
          </div>
        </form>

        {/* Social Logins */}
        <div className="mt-10">
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative px-4 text-[10px] uppercase tracking-widest bg-black text-gray-500 font-semibold">Or Continue With</div>
          </div>
          
          <div className="flex space-x-4">
             <button onClick={handleFakeLogin} className="flex-1 flex items-center justify-center bg-[#111] border border-white/10 py-3.5 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                   <path fill="#ffffff" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                </svg>
                <span className="text-[12px] font-bold text-white">Google</span>
             </button>
             <button onClick={handleFakeLogin} className="flex-1 flex items-center justify-center bg-[#111] border border-white/10 py-3.5 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="white">
                   <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="text-[12px] font-bold text-white">Facebook</span>
             </button>
          </div>
        </div>

      </div>
    </div>
  );
}
