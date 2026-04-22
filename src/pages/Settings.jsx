import { useAppContext } from '../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Info, ShieldAlert, ChevronRight } from 'lucide-react';

export default function Settings() {
  const { language, toggleLanguage } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[10000] bg-[#f5f5f5] dark:bg-[#050505] text-black dark:text-white flex flex-col font-sans overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#ffffff] dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10 px-4 py-4 flex items-center shadow-sm md:max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="mr-4 text-black dark:text-white hover:text-gold transition-colors active:scale-95">
          <ArrowLeft strokeWidth={2} className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-bold tracking-wider uppercase">Settings</h1>
      </div>

      <div className="px-4 pt-6 flex-1 flex flex-col md:max-w-2xl mx-auto w-full space-y-4">
        
        <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <button onClick={toggleLanguage} className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               <Globe className="w-5 h-5 mr-3 text-[#D4AF37]" strokeWidth={1.5} />
               <div className="flex flex-col text-left">
                 <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">Language Options</span>
                 <span className="text-[10px] text-gray-400 mt-0.5">Toggle between English and Amharic</span>
               </div>
             </div>
             <div className="flex items-center">
                <span className="text-[12px] font-bold text-black dark:text-white mr-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                  {language === 'en' ? 'English' : 'አማርኛ'}
                </span>
             </div>
          </button>
        </div>

        <div className="bg-white dark:bg-[#111111] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <Link to="/about" className="w-full flex items-center justify-between py-4 px-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               <Info className="w-5 h-5 mr-3 text-gray-700 dark:text-gray-300" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-gray-800 dark:text-gray-200">About Luna</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>

          <Link to="/admin" className="w-full flex items-center justify-between py-4 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
             <div className="flex items-center">
               <ShieldAlert className="w-5 h-5 mr-3 text-red-500" strokeWidth={1.5} />
               <span className="font-semibold text-[14px] text-red-500">Admin Access</span>
             </div>
             <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>

        <div className="mt-8 text-center opacity-50">
           <p className="text-[10px] font-medium tracking-widest uppercase text-gray-500">Luna Fashion App v2.0</p>
        </div>

      </div>
    </div>
  );
}
