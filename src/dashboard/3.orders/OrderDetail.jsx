import { Link, useParams } from 'react-router-dom';
import { StatusPill } from '../0.overview/DashboardHome';
import { useAdmin } from '../../context/AdminContext';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/formatters';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, customers, products, updateOrderStatus } = useAdmin();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-espresso-400">Order not found.</p>
        <Link to="/dashboard/orders" className="mt-4 inline-block text-[11px] uppercase tracking-widest text-gold-600">← Orders</Link>
      </div>
    );
  }

  const customer = customers.find((c) => c.id === order.customerId);
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/dashboard/orders" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">← Orders</Link>
          <h1 className="mt-2 font-display text-3xl text-espresso-700">{order.id}</h1>
          <p className="mt-1 text-sm text-espresso-400">{formatDate(order.date)} · {order.shipping.method}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={order.status} />
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
            className="border border-ivory-700 bg-ivory-50 px-3 py-2 text-xs uppercase tracking-widest outline-none focus:border-gold-600"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Line items */}
        <section className="border border-ivory-600 bg-ivory-50">
          <h2 className="border-b border-ivory-600 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-400">Line items</h2>
          <ul className="divide-y divide-ivory-400/60">
            {order.items.map((item, i) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <li key={i} className="flex items-center gap-4 px-4 py-3.5">
                  {product && <img src={product.images[0]} alt="" className="h-16 w-12 object-cover" />}
                  <div className="flex-1">
                    <p className="font-medium text-espresso-600">{item.name}</p>
                    <p className="text-xs text-espresso-300">
                      {item.size !== 'one-size' ? item.size.toUpperCase() : 'One Size'} · {item.color} · ×{item.qty}
                    </p>
                  </div>
                  <span className="text-sm text-espresso-500">{formatCurrency(item.price * item.qty, 'EUR')}</span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Meta */}
        <aside className="space-y-6">
          <div className="border border-ivory-600 bg-ivory-50 p-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-400">Customer</h3>
            <p className="font-medium text-espresso-600">{customer?.name || order.customerId}</p>
            <p className="text-xs text-espresso-300">{customer?.email}</p>
          </div>

          <div className="border border-ivory-600 bg-ivory-50 p-5">
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-400">Ship to</h3>
            <p className="text-sm leading-relaxed text-espresso-400">{order.shipping.address}</p>
          </div>

          <div className="border border-ivory-600 bg-ivory-50 p-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-espresso-400">Subtotal</dt><dd>{formatCurrency(subtotal, 'EUR')}</dd></div>
              <div className="flex justify-between border-t border-ivory-600 pt-2 font-display text-lg"><dt>Total</dt><dd>{formatCurrency(order.total, 'EUR')}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
