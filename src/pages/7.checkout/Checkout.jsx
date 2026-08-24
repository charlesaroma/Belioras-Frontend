import { useState } from 'react';
import { Link } from 'react-router-dom';
import CartSummary from '../../components/cart/CartSummary';
import Button from '../../components/common/Button';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

const FIELD = 'w-full border border-ivory-700 bg-ivory-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-600 placeholder:text-espresso-200';

export default function Checkout() {
  const cart = useCart();
  const { t } = useLanguage();
  const [placed, setPlaced] = useState(null);

  const placeOrder = (e) => {
    e.preventDefault();
    const ref = `BLD-${Math.floor(1000 + Math.random() * 9000)}`;
    setPlaced(ref);
    cart.clearCart();
  };

  if (placed) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-success" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-8 font-display text-3xl text-espresso-700">{t('checkout.placedTitle')}</h1>
        <p className="mt-3 text-sm text-espresso-400">{t('checkout.placedMsg')} <span className="font-mono text-espresso-600">{placed}</span></p>
        <Link to="/" className="mt-10">
          <Button variant="primary" size="lg">{t('cart.continueShopping')}</Button>
        </Link>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-2xl text-espresso-700">{t('cart.emptyTitle')}</h1>
        <p className="mt-3 text-sm text-espresso-400">{t('cart.emptyMsg')}</p>
        <Link to="/new-arrivals" className="mt-8 inline-block">
          <Button variant="outline">{t('common.shopNow')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl text-espresso-700">{t('checkout.title')}</h1>
        <div className="mt-4 h-px w-16 bg-gold-500" />
      </header>

      <form onSubmit={placeOrder} className="grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10">
          {/* Contact */}
          <section>
            <h2 className="mb-5 font-display text-xl text-espresso-700">01 · {t('checkout.contact')}</h2>
            <input required type="email" placeholder={t('checkout.email')} className={FIELD} />
          </section>

          {/* Shipping */}
          <section>
            <h2 className="mb-5 font-display text-xl text-espresso-700">02 · {t('checkout.shippingAddress')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input required placeholder={t('checkout.firstName')} className={FIELD} />
              <input required placeholder={t('checkout.lastName')} className={FIELD} />
              <input required placeholder={t('checkout.address')} className={`${FIELD} sm:col-span-2`} />
              <input required placeholder={t('checkout.city')} className={FIELD} />
              <input required placeholder={t('checkout.postal')} className={FIELD} />
              <select className={`${FIELD} sm:col-span-2`} defaultValue="France" aria-label={t('checkout.country')}>
                {['France', 'United Kingdom', 'Germany', 'Italy', 'Spain', 'Nigeria', 'United States'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="mb-5 font-display text-xl text-espresso-700">03 · {t('checkout.payment')}</h2>
            <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
              <input required inputMode="numeric" placeholder={t('checkout.cardNumber')} className={`${FIELD} sm:col-span-3`} />
              <input required placeholder={t('checkout.expiry')} className={`${FIELD} sm:col-span-2`} />
              <input required inputMode="numeric" placeholder={t('checkout.cvc')} className={FIELD} />
            </div>
            <p className="mt-3 text-[11px] text-espresso-300">Demo checkout — no real payment is processed.</p>
          </section>
        </div>

        <CartSummary>
          <ul className="mt-6 space-y-4 border-t border-ivory-600 pt-5">
            {cart.items.map((line) => (
              <li key={line.lineId} className="flex items-center gap-3">
                <img src={line.image} alt="" className="h-14 w-11 object-cover" />
                <div className="flex-1 text-xs">
                  <p className="font-display text-sm text-espresso-700">{line.name}</p>
                  <p className="text-espresso-300">×{line.qty}</p>
                </div>
              </li>
            ))}
          </ul>
          <Button type="submit" variant="primary" size="lg" className="mt-6 w-full">
            {t('checkout.placeOrder')}
          </Button>
        </CartSummary>
      </form>
    </div>
  );
}
