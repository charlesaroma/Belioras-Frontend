import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/formatters';

export default function DashboardHome() {
  const { products, orders, activity } = useAdmin();

  const revenue = orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 5).sort((a, b) => a.stock - b.stock);
  const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const stockColumns = [
    { key: 'name', label: 'Product' },
    { key: 'stock', label: 'Stock', render: (r) => <span className={r.stock <= 2 ? 'font-semibold text-error' : 'text-warning'}>{r.stock}</span> },
    { key: 'price', label: 'Price', render: (r) => formatCurrency(r.price, 'EUR') },
  ];

  const orderColumns = [
    { key: 'id', label: 'Order', render: (r) => (
      <Link to={`/dashboard/orders/${r.id}`} className="font-mono text-xs text-gold-700 hover:text-gold-800">{r.id}</Link>
    ) },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'total', label: 'Total', render: (r) => formatCurrency(r.total, 'EUR') },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl text-espresso-700">Overview</h1>
        <p className="mt-1 text-sm text-espresso-400">{formatDate(new Date().toISOString())} · Maison Belioras</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Revenue (all time)" value={formatCurrency(revenue, 'EUR')} delta="+12.4%" accent />
        <StatCard title="Orders" value={orders.length} delta="+3" />
        <StatCard title="Products live" value={products.length} />
        <StatCard title="Low stock alerts" value={lowStock.length} delta={lowStock.length ? `-${lowStock.length}` : undefined} />
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-espresso-700">Low Stock Alerts</h2>
            <Link to="/dashboard/products" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">Manage →</Link>
          </div>
          <DataTable columns={stockColumns} rows={lowStock.slice(0, 6)} emptyMessage="All stock levels healthy ✓" />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg text-espresso-700">Recent Orders</h2>
            <Link to="/dashboard/orders" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">View all →</Link>
          </div>
          <DataTable columns={orderColumns} rows={recentOrders} />
        </section>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg text-espresso-700">Recent Activity</h2>
        <ul className="divide-y divide-ivory-600 border border-ivory-600 bg-ivory-50">
          {(activity.length ? activity : [{ id: 'x', message: 'No activity yet — start editing products or taxonomies.', at: new Date().toISOString() }]).slice(0, 8).map((a) => (
            <li key={a.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-espresso-500">{a.message}</span>
              <span className="shrink-0 pl-4 font-mono text-[11px] text-espresso-200">{formatDate(a.at)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function StatusPill({ status }) {
  const styles = {
    pending: 'bg-champagne-100 text-brown-700',
    processing: 'bg-info/10 text-info',
    shipped: 'bg-gold-100 text-brown-700',
    delivered: 'bg-success/10 text-success',
    cancelled: 'bg-error/10 text-error',
  };
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}
