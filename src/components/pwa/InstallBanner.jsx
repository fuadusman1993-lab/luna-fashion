import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Prevent the mini-infobar from appearing on mobile
    const handler = (e) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Show our custom unified UI banner
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    setShowBanner(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-[80px] left-0 right-0 z-40 px-4 sm:max-w-md sm:mx-auto">
      <div className="bg-luna-black text-luna-white p-4 rounded-lg shadow-2xl flex items-center justify-between border border-gold/30">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center rounded overflow-hidden shadow-sm bg-black border border-white/20">
             <img src="/logo.jpg" alt="Luna Fashion" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
             <span className="font-medium text-sm">Luna Fashion</span>
             <span className="text-xs text-gray-400">Install for faster checkout</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={handleInstallClick} 
             className="bg-gold text-black px-3 py-1.5 text-xs font-bold uppercase rounded-sm hover:opacity-90"
           >
             Install
           </button>
           <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-white p-1">
             <X className="w-5 h-5" />
           </button>
        </div>
      </div>
    </div>
  );
}
