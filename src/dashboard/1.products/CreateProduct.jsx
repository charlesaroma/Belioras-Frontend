import { useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useAdmin } from '../../context/AdminContext';

const BLANK = {
  name: '',
  slug: '',
  price: '',
  compareAtPrice: '',
  stock: 10,
  description: '',
  sizes: [],
  colors: [],
  images: [],
  tags: [],
};

export default function CreateProduct() {
  const { addProduct } = useAdmin();
  const navigate = useNavigate();

  return (
    <div>
      <header className="mb-8">
        <Link to="/dashboard/products" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">← Products</Link>
        <h1 className="mt-2 font-display text-3xl text-espresso-700">New Product</h1>
      </header>

      <ProductForm
        initial={BLANK}
        onSubmit={(data) => {
          const created = addProduct({ ...data, createdAt: new Date().toISOString().slice(0, 10) });
          navigate(`/dashboard/products/${created.id}/edit`);
        }}
        onCancel={() => navigate('/dashboard/products')}
      />
    </div>
  );
}
