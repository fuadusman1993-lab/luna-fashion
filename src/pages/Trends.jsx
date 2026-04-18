export default function Trends() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black px-4 py-6">
       <h1 className="text-2xl font-bold font-display tracking-widest uppercase mb-6 dark:text-gold text-center pt-2">#TrendingNow</h1>
       <div className="space-y-6">
          <div className="relative h-64 w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm">
             <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" className="w-full h-full object-cover" alt="Trend"/>
             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <span className="text-gold text-xs font-bold uppercase tracking-widest mb-2 border border-gold px-2 py-1 bg-black/50">Lookbook</span>
                <h2 className="text-3xl font-display text-white font-bold italic">Autumn Collection</h2>
             </div>
          </div>
          
          <div className="relative h-64 w-full bg-gray-200 rounded-lg overflow-hidden shadow-sm">
             <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000" className="w-full h-full object-cover" alt="Trend"/>
             <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                <span className="text-black bg-white/90 text-xs font-bold uppercase tracking-widest mb-2 px-2 py-1 shadow-md">Footwear</span>
                <h2 className="text-3xl font-display text-black font-bold uppercase tracking-wider">LUNA Pumps</h2>
             </div>
          </div>
       </div>
    </div>
  )
}
