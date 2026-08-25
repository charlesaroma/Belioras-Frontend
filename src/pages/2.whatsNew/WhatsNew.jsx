import CatalogView from '../3.shop/sections/CatalogView';
import { matchByTokens } from '../../services/productService';
import { useAdmin } from '../../context/AdminContext';

export default function WhatsNew() {
  const { products } = useAdmin();
  const newProducts = matchByTokens(products, ['tag:new']);
  return <CatalogView title="What's New" products={newProducts} />;
}
