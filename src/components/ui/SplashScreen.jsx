import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [fade, setFade] = useState('opacity-0 scale-95');
  const [bgFade, setBgFade] = useState('opacity-100');

  useEffect(() => {
    // Trigger logo fade in
    const timerIn = setTimeout(() => {
      setFade('opacity-100 scale-100');
    }, 100);

    // Trigger content fade out
    const timerOut = setTimeout(() => {
      setFade('opacity-0 scale-105');
    }, 2500);

    // Trigger background fade out
    const timerBgOut = setTimeout(() => {
      setBgFade('opacity-0 pointer-events-none');
    }, 3000);

    // Complete splash exactly at 3.5 seconds
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
      clearTimeout(timerBgOut);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-in-out ${bgFade}`}>
      {/* Map Background with dark overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ease-out ${fade}`}>
        <h1 className="text-4xl md:text-6xl font-serif tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] drop-shadow-[0_0_15px_rgba(212,175,55,0.4)] text-center px-4 leading-tight">
          Welcome to
          <br />
          Luna Fashion
        </h1>
        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
