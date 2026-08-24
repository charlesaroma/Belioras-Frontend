import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { useAdmin } from '../../context/AdminContext';

export default function EditProduct() {
  const { id } = useParams();
  const { products, updateProduct } = useAdmin();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-espresso-400">Product not found.</p>
        <Link to="/dashboard/products" className="mt-4 inline-block text-[11px] uppercase tracking-widest text-gold-600">← Back</Link>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <Link to="/dashboard/products" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">← Products</Link>
        <h1 className="mt-2 font-display text-3xl text-espresso-700">Edit — {product.name}</h1>
        <p className="mt-1 font-mono text-[11px] text-espresso-200">{product.id} · slug: /{product.slug}</p>
      </header>

      <ProductForm
        key={product.id}
        initial={product}
        onSubmit={(patch) => {
          updateProduct(product.id, patch);
          navigate('/dashboard/products');
        }}
        onCancel={() => navigate('/dashboard/products')}
      />
    </div>
  );
}
