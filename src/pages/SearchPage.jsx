import { useProducts } from '../hooks/useProducts';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  // Keep local query input in sync with URL if user navigates back/fwd
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
    } else {
      setSearchParams({});
    }
  };

  const filteredProducts = products.filter(product => {
    if (!initialQuery) return true; // Show all or trending if no query
    const q = initialQuery.toLowerCase();
    return product.name.toLowerCase().includes(q) || 
           product.category.toLowerCase().includes(q) ||
           (product.description && product.description.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans pb-[80px]">
      {/* Header */}
      <div className="w-full bg-[#0a0a0a] border-b border-white/5 mx-auto px-4 py-3 flex items-center justify-between sm:max-w-[480px]">
        <button onClick={() => navigate(-1)} className="p-1 hover:text-gold transition-colors active:scale-95 pr-2">
          <ArrowLeft strokeWidth={2} className="w-6 h-6" />
        </button>
        
        {/* Full Interactive Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-[#1f1f1f] rounded-full px-3 py-2 border border-transparent focus-within:border-gold transition-colors">
          <SearchIcon strokeWidth={1.5} className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search premium collections..." 
            className="bg-transparent border-none outline-none flex-1 text-[13px] font-light tracking-wide text-white w-full placeholder-gray-500"
            autoFocus
          />
        </form>
        
        <button className="p-2 ml-2 hover:text-gold transition-colors shrink-0 active:scale-95">
           <SlidersHorizontal strokeWidth={1.5} className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 pt-4 bg-[#0a0a0a]">
        
        {/* Results Metadata */}
        <div className="px-4 mb-4 flex justify-between items-end">
           <div>
              <h2 className="text-[17px] font-bold tracking-widest uppercase">
                 {initialQuery ? `Results for "${initialQuery}"` : 'Browse All'}
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{filteredProducts.length} Items Found</p>
           </div>
        </div>

        {/* Product Grid Render */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
           </div>
        ) : filteredProducts.length > 0 ? (
           <ProductGrid products={filteredProducts} />
        ) : (
           <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <SearchIcon className="w-12 h-12 text-white/20 mb-4 stroke-[1]" />
              <h3 className="text-[15px] font-bold tracking-widest uppercase text-gray-400 mb-2">No Matches Found</h3>
              <p className="text-[12px] text-gray-600 font-light max-w-xs">We couldn't find anything matching your search. Try adjusting the keywords or browse our categories.</p>
           </div>
        )}
      </div>
    </div>
  );
}
