import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAdmin } from '../../context/AdminContext';
import { useLanguage } from '../../context/LanguageContext';
import ColorSelector from '../product/ColorSelector';
import SizeSelector from '../product/SizeSelector';
import QuantitySelector from '../product/QuantitySelector';

export default function CartItem({ line }) {
  const { updateQty, removeItem, updateVariant } = useCart();
  const { format } = useCurrency();
  const { t } = useLanguage();
  const { products, attributes } = useAdmin();
  const product = products.find((p) => p.id === line.productId);

  const [editingColor, setEditingColor] = useState(false);
  const [editingSize, setEditingSize] = useState(false);

  return (
    <li className="border-b border-ivory-600 px-6 py-5">
      <div className="flex gap-4">
        <Link to={`/product/${line.slug}`} className="shrink-0">
          <img src={line.image} alt={line.name} className="h-28 w-20 object-cover" />
        </Link>

        <div className="flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <Link to={`/product/${line.slug}`} className="font-display text-[15px] leading-snug text-espresso-700 hover:text-gold-700">
              {line.name}
            </Link>
            <button onClick={() => removeItem(line.lineId)} aria-label={t('common.remove')} className="text-xs text-espresso-300 transition-colors hover:text-error">
              ✕
            </button>
          </div>

          <p className="mt-1 text-xs text-espresso-400">
            {t('common.size')}: {line.size === 'one-size' ? 'One Size' : line.size?.toUpperCase()} ·{' '}
            <span className="inline-block h-2.5 w-2.5 translate-y-0.5 rounded-full border border-ivory-700" style={{ backgroundColor: line.color.hex }} /> {line.color.name}
          </p>

          {/* Inline variant editors */}
          <div className="mt-2 space-y-2">
            {editingColor && (
              <div>
                <p className="mb-1.5 text-[10px] uppercase tracking-widest text-gold-600">{t('cart.changeColour')}</p>
                <ColorSelector
                  size="sm"
                  options={product ? product.colors : []}
                  value={line.color.id}
                  onChange={(id) => {
                    const c = attributes.color.values.find((v) => v.id === id);
                    updateVariant(line.lineId, { color: { id: c.id, name: c.name, hex: c.hex } });
                    setEditingColor(false);
                  }}
                />
              </div>
            )}
            {editingSize && (
              <div>
                <p className="mb-1.5 text-[10px] uppercase tracking-widest text-gold-600">{t('cart.changeSize')}</p>
                <SizeSelector
                  compact
                  options={product ? product.sizes : []}
                  value={line.size}
                  onChange={(size) => {
                    updateVariant(line.lineId, { size });
                    setEditingSize(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              {!editingSize && (
                <button
                  onClick={() => { setEditingSize((v) => !v); setEditingColor(false); }}
                  className="text-[10px] uppercase tracking-widest text-espresso-400 underline underline-offset-4 transition-colors hover:text-espresso-700"
                >
                  {t('cart.changeSize')}
                </button>
              )}
              {!editingColor && (
                <button
                  onClick={() => { setEditingColor((v) => !v); setEditingSize(false); }}
                  className="text-[10px] uppercase tracking-widest text-espresso-400 underline underline-offset-4 transition-colors hover:text-espresso-700"
                >
                  {t('cart.changeColour')}
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <QuantitySelector value={line.qty} onChange={(delta) => updateQty(line.lineId, delta - line.qty)} min={1} max={99} />
            <p className="text-sm text-espresso-600">{format(line.price * line.qty)}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
