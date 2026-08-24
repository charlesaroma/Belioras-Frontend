import { Link } from 'react-router-dom';
import Drawer from '../common/Drawer';
import Button from '../common/Button';
import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CartDrawer() {
  const cart = useCart();
  const { format } = useCurrency();
  const { t } = useLanguage();

  return (
    <Drawer open={cart.isOpen} onClose={cart.closeDrawer} title={`${t('cart.title')} (${cart.count})`}>
      {cart.items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex h-full flex-col">
          <ul className="flex-1">
            {cart.items.map((line) => (
              <CartItem key={line.lineId} line={line} />
            ))}
          </ul>

          <div className="border-t border-ivory-600 bg-ivory-100 px-6 py-5">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.25em] text-espresso-500">{t('cart.subtotal')}</span>
              <span className="font-display text-lg text-espresso-700">{format(cart.subtotal)}</span>
            </div>
            <p className="mb-4 text-[11px] text-espresso-300">{t('cart.shippingNote')}</p>
            <Link to="/checkout" onClick={cart.closeDrawer} className="block">
              <Button variant="primary" size="lg" className="w-full">{t('cart.checkout')}</Button>
            </Link>
            <button
              onClick={cart.closeDrawer}
              className="mt-3 block w-full text-center text-[11px] uppercase tracking-widest text-espresso-400 transition-colors hover:text-espresso-700"
            >
              {t('cart.continueShopping')}
            </button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
