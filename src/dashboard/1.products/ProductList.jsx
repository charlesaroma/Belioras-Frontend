import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { searchProducts } from '../../services/productService';
import { formatCurrency } from '../../utils/currencyFormatter';

export default function ProductList() {
  const { products, deleteProduct } = useAdmin();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);

  const rows = useMemo(() => searchProducts(products, query), [products, query]);

  const toggleSelect = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  const batchDelete = () => {
    if (!window.confirm(`Delete ${selected.length} product(s)? This cannot be undone.`)) return;
    selected.forEach((id) => deleteProduct(id));
    setSelected([]);
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (r) => (
        <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} className="accent-espresso-700" />
      ),
    },
    {
      key: 'images',
      label: 'Image',
      render: (r) => <img src={r.images[0]} alt="" className="h-14 w-10 object-cover" />,
    },
    { key: 'name', label: 'Product', render: (r) => (
      <div>
        <p className="font-medium text-espresso-600">{r.name}</p>
        <p className="font-mono text-[10px] text-espresso-200">{r.id}</p>
      </div>
    ) },
    { key: 'price', label: 'Price', render: (r) => formatCurrency(r.price, 'EUR') },
    {
      key: 'stock',
      label: 'Stock',
      render: (r) => <span className={r.stock <= 5 ? 'font-semibold text-error' : ''}>{r.stock}</span>,
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.tags.filter((t) => t.startsWith('tag:')).map((t) => (
            <span key={t} className="rounded-full bg-champagne-100 px-2 py-0.5 text-[9px] uppercase tracking-widest text-brown-700">
              {t.replace('tag:', '')}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const rowActions = (row) => (
    <div className="flex justify-end gap-3 text-xs">
      <Link to={`/dashboard/products/${row.id}/edit`} className="text-gold-700 hover:text-gold-800">Edit</Link>
      <button
        onClick={() => window.confirm(`Delete “${row.name}”?`) && deleteProduct(row.id)}
        className="text-espresso-300 transition-colors hover:text-error"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-espresso-700">Products</h1>
          <p className="mt-1 text-sm text-espresso-400">{products.length} in catalog · changes go live on the storefront instantly</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/dashboard/products/new')}>+ New product</Button>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full max-w-xs border border-ivory-700 bg-ivory-50 px-3 py-2 text-sm outline-none focus:border-gold-600"
        />
        {allSelected && rows.length > 1 && (
          <button
            onClick={() => setSelected(rows.map((r) => r.id))}
            className="text-[11px] uppercase tracking-widest text-gold-700 hover:text-gold-800"
          >
            Select all {rows.length}
          </button>
        )}
        {selected.length > 0 && (
          <>
            <span className="text-xs text-espresso-400">{selected.length} selected</span>
            <button onClick={batchDelete} className="text-[11px] uppercase tracking-widest text-error hover:underline">
              Delete selected
            </button>
          </>
        )}
      </div>

      <DataTable columns={columns} rows={rows} actions={rowActions} emptyMessage="No products match your search." />
    </div>
  );
}
