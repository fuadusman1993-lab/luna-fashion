import { mockProducts } from '../data/products';
import ProductGrid from '../components/product/ProductGrid';
import { motion } from 'framer-motion';

export default function Shop() {
  return (
    <div className="bg-luna-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display uppercase tracking-widest mb-4">The Collection</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-6"></div>
          <p className="text-gray-500 font-light max-w-2xl mx-auto">
            Browse our full catalog of high-end women's fashion. Every piece is a statement.
          </p>
        </motion.div>
        
        <ProductGrid products={mockProducts} />
      </div>
    </div>
  );
}
