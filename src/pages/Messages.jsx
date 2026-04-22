import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Package, Tag, Clock } from 'lucide-react';

export default function Messages() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Promotions');

  const tabs = ['Promotions', 'Order Updates'];

  const handleWhatsAppChat = () => {
    const WHATSAPP_NUMBER = "+251977799797"; 
    const text = "Hello Luna Fashion Support, I have a question regarding my account.";
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#ffffff] dark:bg-[#000000] text-black dark:text-white flex flex-col font-sans overflow-y-auto">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 w-full z-50 bg-[#fcfcfc] dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/10 px-4 py-4 flex items-center shadow-sm md:max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="mr-4 text-black dark:text-white hover:text-gold transition-colors active:scale-95">
          <ArrowLeft strokeWidth={2} className="w-6 h-6" />
        </button>
        <h1 className="text-[17px] font-bold tracking-wider uppercase">Messages</h1>
      </div>

      <div className="pt-[80px] px-4 flex-1 flex flex-col pb-[120px] md:max-w-2xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-200 dark:border-white/10 mb-6 px-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[13px] font-bold uppercase tracking-wider transition-colors relative ${activeTab === tab ? 'text-gold' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gold rounded-t-md"></div>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'Promotions' && (
          <div className="flex flex-col space-y-4">
            <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 p-4 rounded-xl shadow-sm dark:shadow-lg">
              <div className="flex items-center text-gold mb-2">
                <Tag className="w-4 h-4 mr-2" />
                <span className="text-[11px] font-bold uppercase tracking-widest">Flash Sale</span>
              </div>
              <h3 className="text-[15px] font-medium mb-1">Up to 40% Off Premium Bags</h3>
              <p className="text-[12px] text-gray-500 dark:text-gray-400 font-light leading-relaxed mb-3">Our exclusive selection of Occasion Bags just got restocked. Grab yours before they run out!</p>
              <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-600">
                <Clock className="w-3 h-3 mr-1" /> Just now
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 p-4 rounded-xl shadow-sm dark:shadow-lg opacity-80">
               <div className="flex items-center text-gray-400 mb-2">
                 <Tag className="w-4 h-4 mr-2" />
                 <span className="text-[11px] font-bold uppercase tracking-widest">Welcome</span>
               </div>
               <h3 className="text-[15px] font-medium mb-1 text-gray-800 dark:text-gray-300">Welcome to Luna Fashion</h3>
               <p className="text-[12px] text-gray-500 font-light leading-relaxed mb-3">Enjoy your seamless shopping experience. Free shipping on your first big order.</p>
               <div className="flex items-center text-[10px] text-gray-500 dark:text-gray-600">
                 <Clock className="w-3 h-3 mr-1" /> 2 days ago
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Order Updates' && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <Package className="w-12 h-12 text-gray-600 mb-4 stroke-[1]" />
            <h3 className="text-[14px] font-bold tracking-widest uppercase text-gray-400 mb-2">No active orders</h3>
            <p className="text-[12px] text-gray-600 font-light">Updates on your package shipments will appear here.</p>
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-[90px] left-0 right-0 md:max-w-2xl mx-auto px-4 pointer-events-none z-40 w-full">
        <button 
          onClick={handleWhatsAppChat}
          className="w-full pointer-events-auto bg-[#D4AF37] text-black h-[54px] rounded-full font-bold uppercase tracking-widest flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all active:scale-95 hover:scale-[1.02]"
        >
          <MessageCircle className="w-5 h-5 mr-3" strokeWidth={2.5} />
          Chat With Us
        </button>
      </div>

    </div>
  );
}
