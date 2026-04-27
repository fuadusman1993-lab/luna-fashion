import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }) {
  const [fade, setFade] = useState('opacity-0 scale-95');
  const [bgFade, setBgFade] = useState('opacity-100');

  useEffect(() => {
    // Trigger logo fade in
    const timerIn = setTimeout(() => {
      setFade('opacity-100 scale-100');
    }, 100);

    // Trigger logo fade out
    const timerOut = setTimeout(() => {
      setFade('opacity-0 scale-105');
    }, 2000);

    // Trigger background fade out
    const timerBgOut = setTimeout(() => {
      setBgFade('opacity-0 pointer-events-none');
    }, 2500);

    // Complete splash at exactly 3 seconds
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timerIn);
      clearTimeout(timerOut);
      clearTimeout(timerBgOut);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-500 ease-in-out ${bgFade}`}>
      <img 
        src="/splash-logo.png" 
        alt="Luna Fashion" 
        className={`w-64 md:w-80 h-auto object-contain transition-all duration-1000 ease-out drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] ${fade}`}
      />
    </div>
  );
}
