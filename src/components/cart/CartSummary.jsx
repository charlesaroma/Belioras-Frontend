import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CartSummary({ showShipping = true, children }) {
  const cart = useCart();
  const { format } = useCurrency();
  const { t } = useLanguage();

  const shipping = cart.subtotal >= 200 || cart.subtotal === 0 ? 0 : 12;

  return (
    <aside className="h-fit border border-ivory-600 bg-ivory-100 p-6">
      <h3 className="font-display text-lg text-espresso-700">{t('checkout.summary')}</h3>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-espresso-400">{t('checkout.subtotal')}</dt>
          <dd>{format(cart.subtotal)}</dd>
        </div>
        {showShipping && (
          <div className="flex justify-between">
            <dt className="text-espresso-400">{t('checkout.shipping')}</dt>
            <dd>{shipping === 0 ? t('checkout.free') : format(shipping)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-ivory-600 pt-3 font-display text-lg">
          <dt>{t('checkout.total')}</dt>
          <dd>{format(cart.subtotal + shipping)}</dd>
        </div>
      </dl>

      {children}
    </aside>
  );
}
