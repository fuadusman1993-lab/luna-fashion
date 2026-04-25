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
    }, 2000);

    // Complete splash
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden">
      <img 
        src="/logo.jpg" 
        alt="Luna Fashion" 
        className={`w-48 md:w-64 h-auto object-contain transition-all duration-1000 ease-out ${fade}`}
      />
    </div>
  );
}
