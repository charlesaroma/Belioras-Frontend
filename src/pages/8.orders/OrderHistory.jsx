import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { StatusPill } from '../../dashboard/0.overview/DashboardHome';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSession } from '../../services/authService';
import { DATA } from '../../services/jsonDataLoader';
import { formatDate } from '../../utils/formatters';

const DATE_LOCALES = { en: 'en-GB', fr: 'fr-FR', de: 'de-DE', zh: 'zh-CN', es: 'es-ES', it: 'it-IT' };

function EmptyState({ icon, title, message, ctaLabel, ctaTo }) {
  return (
    <div className="flex flex-col items-center gap-5 border border-ivory-600 bg-ivory-100 py-24 text-center">
      {icon}
      <h2 className="font-display text-xl text-espresso-700">{title}</h2>
      <p className="max-w-xs text-sm text-espresso-400">{message}</p>
      <Link to={ctaTo}>
        <Button variant="outline" size="sm">{ctaLabel}</Button>
      </Link>
    </div>
  );
}

const BagIcon = (
  <svg viewBox="0 0 24 24" className="h-12 w-12 text-espresso-200" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M4 7h16M6 7l1 13h10l1-13M9 7V5a3 3 0 0 1 6 0v2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function OrderHistory() {
  const { orders, products } = useAdmin();
  const { format } = useCurrency();
  const { t, lang } = useLanguage();
  const session = getSession();

  const customer = session
    ? DATA.customers.find((c) => c.email.toLowerCase() === session.email.toLowerCase())
    : null;

  const myOrders = customer
    ? [...orders]
        .filter((o) => o.customerId === customer.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  const productFor = (productId) => products.find((p) => p.id === productId);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl text-espresso-700">{t('orders.title')}</h1>
        {session && <p className="mt-2 text-sm text-espresso-400">{myOrders.length} orders</p>}
        <div className="mt-4 h-px w-16 bg-gold-500" />
      </header>

      {!session ? (
        <EmptyState
          icon={BagIcon}
          title={t('orders.signInTitle')}
          message={t('orders.signInMsg')}
          ctaLabel={t('orders.signIn')}
          ctaTo="/login"
        />
      ) : myOrders.length === 0 ? (
        <EmptyState
          icon={BagIcon}
          title={t('orders.emptyTitle')}
          message={t('orders.emptyMsg')}
          ctaLabel={t('orders.browse')}
          ctaTo="/shop"
        />
      ) : (
        <div className="space-y-6">
          {myOrders.map((order) => (
            <article key={order.id} className="border border-ivory-600 bg-ivory-50">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-600 bg-ivory-100 px-6 py-4">
                <div>
                  <p className="font-mono text-xs text-espresso-400">{order.id}</p>
                  <p className="mt-0.5 text-sm text-espresso-500">
                    {t('orders.placedOn')} {formatDate(order.date, DATE_LOCALES[lang] || 'en-GB')}
                  </p>
                </div>
                <StatusPill status={order.status} />
              </div>

              <div className="divide-y divide-ivory-600">
                {order.items.map((item, i) => {
                  const product = productFor(item.productId);
                  const image = product?.images?.[0];
                  const row = (
                    <div className="flex items-center gap-4 px-6 py-4">
                      {image && <img src={image} alt="" loading="lazy" className="h-16 w-16 shrink-0 object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-espresso-700">{item.name}</p>
                        <p className="mt-0.5 text-xs text-espresso-400">
                          {item.size && item.size !== 'one-size' ? `${item.size.toUpperCase()} · ` : ''}
                          {item.color} · {t('common.quantity')} {item.qty}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm text-espresso-600">{format(item.price * item.qty)}</p>
                    </div>
                  );
                  return product ? (
                    <Link key={i} to={`/product/${product.slug}`} className="block transition-colors hover:bg-ivory-100">
                      {row}
                    </Link>
                  ) : (
                    <div key={i}>{row}</div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ivory-600 px-6 py-4 text-sm">
                <p className="text-espresso-400">
                  {order.shipping?.method} · {order.shipping?.address}
                </p>
                <p className="font-medium text-espresso-700">
                  {t('checkout.total')}: {format(order.total)}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
