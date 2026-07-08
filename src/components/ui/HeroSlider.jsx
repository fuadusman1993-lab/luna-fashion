import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=2000&auto=format&fit=crop",
    subtitle: "NEW COLLECTION",
    title: "ELEGANCE IN EVERY THREAD",
    description: "Discover our latest styles made for you with love and perfection.",
    buttonText: "SHOP NOW"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1616428205459-af2c11438b4d?q=80&w=2000&auto=format&fit=crop",
    subtitle: "LUXURY EDIT",
    title: "TIMELESS BEAUTY",
    description: "Embrace sophistication with our hand-crafted evening gowns.",
    buttonText: "DISCOVER"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden group bg-black">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover object-top scale-105 transform origin-center"
              style={{ animation: index === currentSlide ? 'kenburns 20s infinite alternate' : 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
            <div className="max-w-xl">
              <span className="inline-block bg-[#D4AF37] text-black text-[10px] md:text-[12px] font-bold px-3 py-1 uppercase tracking-widest mb-4">
                {slide.subtitle}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white font-bold mb-4 leading-tight">
                {slide.title}
              </h2>
              <p className="text-gray-300 text-sm md:text-base font-light mb-8 max-w-md">
                {slide.description}
              </p>
              <button className="bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest text-[12px] md:text-[13px] px-8 py-3 rounded-full transition-colors flex items-center group/btn shadow-lg">
                {slide.buttonText}
                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/20 hover:bg-black/50 text-white backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-white/10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === currentSlide ? 'w-8 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
