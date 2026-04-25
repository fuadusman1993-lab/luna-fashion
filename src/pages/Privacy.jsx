import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Scale } from 'lucide-react';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[10000] bg-[#0a0a0a] text-white flex flex-col font-sans overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      
      {/* Header - Back Arrow on Left */}
      <div className="sticky top-0 left-0 right-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md px-4 py-4 flex items-center justify-start md:max-w-2xl mx-auto border-b border-white/5">
        <button onClick={() => navigate(-1)} className="text-white hover:text-[#D4AF37] transition-colors active:scale-95 shrink-0 flex items-center">
          <ArrowLeft strokeWidth={1.5} className="w-[22px] h-[22px]" />
          <span className="ml-2 font-medium text-[15px]">Privacy & Terms</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:max-w-2xl mx-auto w-full px-5 py-8 pb-12">
         
         <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-[#111111] rounded-full border border-white/10 flex items-center justify-center">
               <ShieldCheck className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
            </div>
         </div>
         
         <h1 className="text-2xl font-display font-bold text-center text-white mb-2">Privacy Policy</h1>
         <p className="text-[12px] text-gray-500 text-center uppercase tracking-widest mb-10">Last Updated: October 2026</p>

         <div className="space-y-8 text-[13px] text-gray-400 leading-relaxed">
            <section>
               <h2 className="text-[15px] font-bold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2"></span> Data Collection
               </h2>
               <p>
                  At Luna Fashion, we prioritize your privacy. We collect essential information such as your name, shipping address, and contact details solely to process and fulfill your orders efficiently. Your payment information is securely processed through our trusted payment gateways and is never stored on our servers.
               </p>
            </section>

            <section>
               <h2 className="text-[15px] font-bold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2"></span> Use of Information
               </h2>
               <p>
                  The data we collect is used to enhance your shopping experience, provide customer support, and inform you about exclusive offers and new arrivals if you have opted into our push notifications. We do not sell, rent, or share your personal information with third parties for marketing purposes.
               </p>
            </section>

            <div className="h-[1px] w-full bg-white/10 my-10"></div>

            <div className="flex items-center justify-center mb-8">
               <div className="w-16 h-16 bg-[#111111] rounded-full border border-white/10 flex items-center justify-center">
                  <Scale className="w-8 h-8 text-[#D4AF37]" strokeWidth={1.5} />
               </div>
            </div>

            <h1 className="text-2xl font-display font-bold text-center text-white mb-10">Terms of Service</h1>

            <section>
               <h2 className="text-[15px] font-bold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2"></span> Product Information
               </h2>
               <p>
                  We strive to display our products as accurately as possible. However, the actual colors you see will depend on your monitor or mobile device, and we cannot guarantee that your display will be entirely accurate. All prices are in Ethiopian Birr (ETB) and are subject to change without notice.
               </p>
            </section>

            <section>
               <h2 className="text-[15px] font-bold text-white mb-3 flex items-center">
                  <span className="w-2 h-2 bg-[#D4AF37] rounded-full mr-2"></span> Shipping & Returns
               </h2>
               <p>
                  All orders are subject to availability and confirmation of the order price. Dispatch times may vary. If you are not completely satisfied with your purchase, you may return the item within 7 days of receipt for an exchange or store credit, provided the item is unworn and in its original condition.
               </p>
            </section>
         </div>

      </div>
    </div>
  );
}
