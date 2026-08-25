import WishlistItem from './WishlistItem';
import { COLUMN_CLASSES } from '../../../components/product/gridColumns';
import { useFilters } from '../../../context/FilterContext';

export default function WishlistGrid({ products = [] }) {
  const { columns } = useFilters();

  return (
    <div className={`grid gap-x-5 gap-y-10 ${COLUMN_CLASSES[columns] || COLUMN_CLASSES[3]}`}>
      {products.map((p) => (
        <WishlistItem key={p.id} product={p} />
      ))}
    </div>
  );
}
