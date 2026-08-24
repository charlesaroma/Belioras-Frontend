import ProductCard from './ProductCard';
import { COLUMN_CLASSES } from './gridColumns';

export default function ProductGrid({ products = [], columns = 3 }) {
  if (!products.length) {
    return <p className="py-20 text-center font-display text-lg text-espresso-300">No pieces match your selection.</p>;
  }
  return (
    <div className={`grid gap-x-5 gap-y-12 ${COLUMN_CLASSES[columns] || COLUMN_CLASSES[3]}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
