import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

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

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col font-sans relative z-[50]">
      
      {/* Header - Back Arrow on Left */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md px-4 py-4 flex items-center justify-start md:max-w-2xl mx-auto border-b border-white/5">
        <button onClick={() => navigate(-1)} className="text-white hover:text-[#D4AF37] transition-colors active:scale-95 shrink-0 flex items-center">
          <ArrowLeft strokeWidth={1.5} className="w-[22px] h-[22px]" />
          <span className="ml-2 font-medium text-[15px]">About Us</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:max-w-2xl mx-auto w-full">
         
         <div className="w-full h-[220px] relative">
            <img src="https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2000&auto=format&fit=crop" alt="Luna Storefront View" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent"></div>
         </div>

         <div className="px-5 -mt-10 relative z-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wide uppercase drop-shadow-md">Luna Fashion</h1>
            <div className="w-10 h-[3px] bg-[#D4AF37] mb-6"></div>

            <p className="text-[13px] text-gray-400 leading-relaxed font-medium mb-8">
               Welcome to the pinnacle of modest elegance. Luna Fashion is more than just a brand; it is a celebration of the modern woman. Born in the heart of Addis Ababa, our designs merge global luxury standards with a distinct, elegant aesthetic tailored for every occasion.
            </p>

            <h2 className="text-[14px] font-bold text-white uppercase tracking-widest mb-4">Our Commitment</h2>
            <p className="text-[13px] text-gray-400 leading-relaxed font-medium mb-10">
               We believe that every piece of clothing should make a statement. That's why we painstakingly select only the finest fabrics, ensuring that our abayas, gowns, and blazers are not just worn, but experienced.
            </p>

            <h2 className="text-[14px] font-bold text-white uppercase tracking-widest mb-4">Connect With Us</h2>
            <div className="flex items-center space-x-4 mb-10">
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

            <div className="bg-[#111111] border border-white/5 p-5 rounded-xl mb-12">
               <h3 className="font-bold text-[12px] text-white uppercase tracking-wider flex items-center mb-4">
                  <MapPin className="w-[14px] h-[14px] text-[#D4AF37] mr-2" /> Our Stores
               </h3>
               
               <div className="space-y-4">
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[13px] font-bold text-white">Jemo Branch</p>
                        <p className="text-[11px] text-gray-400 mt-1">Sun Moon Star Mall<br/>1st Floor, Shop No. 06</p>
                     </div>
                     <a href="https://maps.google.com/?q=Sun+Moon+Star+Mall+Jemo+Addis+Ababa" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-[#D4AF37] text-black px-3 py-1.5 rounded uppercase tracking-wider">Directions</a>
                  </div>
                  <div className="h-[1px] w-full bg-white/5"></div>
                  <div className="flex justify-between items-start">
                     <div>
                        <p className="text-[13px] font-bold text-white">Bethel Branch</p>
                        <p className="text-[11px] text-gray-400 mt-1">Mira Mall<br/>1st Floor</p>
                     </div>
                     <a href="https://maps.google.com/?q=Mira+Mall+Bethel+Addis+Ababa" target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold bg-[#D4AF37] text-black px-3 py-1.5 rounded uppercase tracking-wider">Directions</a>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
}
