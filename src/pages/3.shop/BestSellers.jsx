import CatalogView from './sections/CatalogView';
import { matchByTokens } from '../../services/productService';import { useAdmin } from '../../context/AdminContext';

export default function BestSellers() {
  const { products } = useAdmin();
  const bestSellers = matchByTokens(products, ['tag:bestseller']);
  return <CatalogView title="Best Sellers" products={bestSellers} />;
}
