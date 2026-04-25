import ProductCard from './ProductCard';
import { PackageOpen } from 'lucide-react';
import { memo } from 'react';

export default memo(function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4 w-full">
         <PackageOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-3" strokeWidth={1} />
         <h2 className="text-[15px] font-bold text-gray-900 dark:text-white tracking-widest uppercase">Collection coming soon</h2>
         <p className="text-[11px] text-gray-500 mt-2">We are preparing our premium arrivals. Stay tuned!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6 px-3 md:px-4 mx-auto w-full pb-8">
      {products.map((product, index) => (
         <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
});
