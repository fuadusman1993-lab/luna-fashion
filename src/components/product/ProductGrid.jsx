import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  return (
    <div className="columns-2 gap-3 px-3 mx-auto w-full">
      {products.map((product) => (
        <div key={product.id} className="break-inside-avoid mb-3">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
