import { Link } from 'react-router-dom';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import CartSummary from './CartSummary';
import Button from '../common/Button';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CartPageView() {
  const cart = useCart();
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-10 flex items-baseline justify-between">
        <h1 className="font-display text-3xl text-espresso-700">{t('cart.title')}</h1>
        {cart.items.length > 0 && (
          <Link to="/new-arrivals" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">
            {t('cart.continueShopping')} →
          </Link>
        )}
      </div>

      {cart.items.length === 0 ? (
        <div className="border border-ivory-600 bg-ivory-100">
          <EmptyCart />
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <ul className="divide-y divide-ivory-600 border-y border-ivory-600">
            {cart.items.map((line) => (
              <CartItem key={line.lineId} line={line} />
            ))}
          </ul>
          <CartSummary>
            <Link to="/checkout" className="mt-6 block">
              <Button variant="primary" size="lg" className="w-full">{t('cart.checkout')}</Button>
            </Link>
            <button
              onClick={cart.clearCart}
              className="mt-3 w-full text-center text-[11px] uppercase tracking-widest text-espresso-300 transition-colors hover:text-error"
            >
              Clear bag
            </button>
          </CartSummary>
        </div>
      )}
    </div>
  );
}
