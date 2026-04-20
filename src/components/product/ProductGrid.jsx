import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 gap-2 px-2 mx-auto w-full">
      {products.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
