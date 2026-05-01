import { useProducts } from '../hooks/useProducts';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SearchPage() {
  const { products, loading, loadMore, hasMore } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Keep local query input in sync with URL if user navigates back/fwd
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      setShowSuggestions(false);
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

  // Trending categories to show when empty
  const defaultSuggestions = [
    { id: 'trend-1', name: 'Trending: Abaya', category: 'Abaya', isTrending: true },
    { id: 'trend-2', name: 'Trending: Makhawar', category: 'Makhawar', isTrending: true },
    { id: 'trend-3', name: 'Trending: Heels', category: 'Shoes', isTrending: true },
    { id: 'trend-4', name: 'Trending: Dresses', category: 'Dresses', isTrending: true },
  ];

  // Live suggestions based on the current 'query' state (what they are currently typing, not yet submitted)
  const suggestions = query.trim() ? products.filter(product => {
    const q = query.toLowerCase();
    return product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q);
  }).slice(0, 5) : defaultSuggestions;

  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion.id}`, { state: { product: suggestion } });
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-[#ffffff] dark:bg-[#000000] text-black dark:text-white flex flex-col font-sans overflow-y-auto">
      {/* Header */}
      <div className="relative w-full bg-[#fcfcfc] dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/5 mx-auto px-4 py-3 flex items-center justify-between md:px-6 z-50">
        <button onClick={() => navigate(-1)} className="p-1 hover:text-gold transition-colors active:scale-95 pr-2">
          <ArrowLeft strokeWidth={2} className="w-6 h-6" />
        </button>
        
        {/* Full Interactive Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center bg-gray-100 dark:bg-[#1f1f1f] rounded-full px-3 py-2 border border-transparent focus-within:border-gold transition-colors relative z-50">
          <SearchIcon strokeWidth={1.5} className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 shrink-0" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search premium collections..." 
            className="bg-transparent border-none outline-none flex-1 text-[13px] font-light tracking-wide text-black dark:text-white w-full placeholder-gray-400 dark:placeholder-gray-500"
            autoFocus
          />

          {/* Live Search Suggestions Dropdown pinned directly below input */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-[115%] left-0 right-0 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] overflow-hidden z-[100] animate-in fade-in zoom-in-95">
              <ul>
                {suggestions.map((suggestion) => (
                  <li 
                    key={suggestion.id} 
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (suggestion.isTrending) {
                        setQuery(suggestion.category);
                        setSearchParams({ q: suggestion.category });
                        setShowSuggestions(false);
                      } else {
                        handleSuggestionClick(suggestion);
                      }
                    }}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border-b border-gray-100 dark:border-white/5 last:border-0 transition-colors"
                  >
                    <SearchIcon className="w-3.5 h-3.5 text-gray-400 mr-3 shrink-0" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[13px] font-medium text-black dark:text-white truncate">{suggestion.name}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest">{suggestion.category.split('(')[0].trim()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>
        
        <button className="p-2 ml-2 hover:text-gold transition-colors shrink-0 active:scale-95">
           <SlidersHorizontal strokeWidth={1.5} className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 pt-4 bg-[#ffffff] dark:bg-[#0a0a0a] pb-[40px]">
        
        {/* Results Metadata */}
        <div className="px-4 mb-4 flex justify-between items-end">
           <div>
              <h2 className="text-[17px] font-bold tracking-widest uppercase">
                 {initialQuery ? `Results for "${initialQuery}"` : 'Browse All'}
              </h2>
              <p className="text-[10px] text-[#22c55e] font-bold uppercase tracking-widest mt-1">{filteredProducts.length} Items Found</p>
           </div>
        </div>

        {/* Product Grid Render */}
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
           </div>
        ) : filteredProducts.length > 0 ? (
           <div className="flex flex-col items-center">
             <div className="w-full">
               <ProductGrid products={filteredProducts} />
             </div>
             {hasMore && (
               <button 
                 onClick={loadMore} 
                 disabled={loading}
                 className="mt-6 mb-8 border border-black dark:border-white text-black dark:text-white font-bold uppercase tracking-widest text-[11px] px-8 py-3 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors disabled:opacity-50"
               >
                 {loading ? 'Loading...' : 'Load More'}
               </button>
             )}
           </div>
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
