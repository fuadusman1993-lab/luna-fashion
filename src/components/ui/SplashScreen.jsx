import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [fade, setFade] = useState('opacity-0 scale-95');

  useEffect(() => {
    // Trigger fade in
    const timerIn = setTimeout(() => {
      setFade('opacity-100 scale-100');
    }, 100);

    // Trigger fade out
    const timerOut = setTimeout(() => {
      setFade('opacity-0 scale-105');
    }, 1000);

    // Complete splash
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden">
      <img 
        src="/splash-logo.png" 
        alt="Luna Fashion" 
        className={`w-64 md:w-80 h-auto object-contain transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] ${fade}`}
      />
    </div>
  );
}
