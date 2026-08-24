import DataTable from '../components/DataTable';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/formatters';

export default function CustomerList() {
  const { customers, orders } = useAdmin();

  const rows = customers.map((c) => ({
    ...c,
    liveOrders: orders.filter((o) => o.customerId === c.id).length,
  }));

  const columns = [
    { key: 'name', label: 'Customer', render: (r) => (
      <div>
        <p className="font-medium text-espresso-600">{r.name}</p>
        <p className="text-xs text-espresso-300">{r.email}</p>
      </div>
    ) },
    { key: 'joined', label: 'Joined', render: (r) => formatDate(r.joined) },
    { key: 'liveOrders', label: 'Orders', render: (r) => <span className="font-mono text-xs">{r.liveOrders}</span> },
    { key: 'totalSpent', label: 'Lifetime spend', render: (r) => formatCurrency(r.totalSpent, 'EUR') },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl text-espresso-700">Customers</h1>
        <p className="mt-1 text-sm text-espresso-400">{customers.length} registered</p>
      </header>

      <DataTable columns={columns} rows={rows} emptyMessage="No customers yet." />
    </div>
  );
}
