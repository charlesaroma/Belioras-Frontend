import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/DataTable';
import { StatusPill } from '../0.overview/DashboardHome';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/formatters';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderList() {
  const { orders, customers } = useAdmin();
  const [statusFilter, setStatusFilter] = useState('all');

  const rows = useMemo(
    () =>
      [...orders]
        .filter((o) => statusFilter === 'all' || o.status === statusFilter)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((o) => {
          const customer = customers.find((c) => c.id === o.customerId);
          return { ...o, customerName: customer?.name || o.customerId };
        }),
    [orders, customers, statusFilter],
  );

  const columns = [
    { key: 'id', label: 'Order', render: (r) => (
      <Link to={`/dashboard/orders/${r.id}`} className="font-mono text-xs text-gold-700 hover:text-gold-800">{r.id}</Link>
    ) },
    { key: 'customerName', label: 'Customer' },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'items', label: 'Items', render: (r) => r.items.reduce((s, i) => s + i.qty, 0) },
    { key: 'status', label: 'Status', render: (r) => <StatusPill status={r.status} /> },
    { key: 'total', label: 'Total', render: (r) => formatCurrency(r.total, 'EUR') },
  ];

  const rowActions = (row) => (
    <Link to={`/dashboard/orders/${row.id}`} className="text-xs text-gold-700 hover:text-gold-800">Inspect</Link>
  );

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl text-espresso-700">Orders</h1>
        <p className="mt-1 text-sm text-espresso-400">{orders.length} total</p>
      </header>

      <div className="mb-4 flex gap-2">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`border px-3 py-1.5 text-[11px] uppercase tracking-widest transition-colors ${
              statusFilter === s ? 'border-espresso-700 bg-espresso-700 text-ivory-50' : 'border-ivory-700 text-espresso-400 hover:border-espresso-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <DataTable columns={columns} rows={rows} actions={rowActions} />
    </div>
  );
}
