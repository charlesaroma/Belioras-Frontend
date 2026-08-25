import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductGallery from './sections/ProductGallery';
import ColorSelector from '../../components/product/ColorSelector';
import SizeSelector from '../../components/product/SizeSelector';
import QuantitySelector from '../../components/product/QuantitySelector';
import ProductCard from '../../components/product/ProductCard';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

const SIZE_TABLE = [
  { size: 'XS', bust: 80, waist: 62, hips: 88 },
  { size: 'S', bust: 84, waist: 66, hips: 92 },
  { size: 'M', bust: 88, waist: 70, hips: 96 },
  { size: 'L', bust: 94, waist: 76, hips: 102 },
  { size: 'XL', bust: 100, waist: 82, hips: 108 },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const { products } = useAdmin();
  const cart = useCart();
  const wishlist = useWishlist();
  const { format } = useCurrency();
  const { t } = useLanguage();

  const product = products.find((p) => p.slug === slug);
  const [colorId, setColorId] = useState(product?.colors?.[0] || null);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [error, setError] = useState('');
  const [addedFlash, setAddedFlash] = useState(false);

  const related = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.id !== product.id && p.tags.some((tag) => tag.startsWith('cat:') && product.tags.includes(tag)))
            .slice(0, 4)
        : [],
    [products, product],
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="font-display text-3xl text-espresso-700">Piece not found</h1>
        <p className="mt-3 text-sm text-espresso-400">It may have sold out or been retired from the collection.</p>
        <Link to="/shop" className="mt-6 inline-block text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">
          ← Back to the shop
        </Link>
      </div>
    );
  }

  const saved = wishlist.has(product.id);
  const compareAt = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice : null;

  const handleAdd = () => {
    if (!size) {
      setError(t('pdp.selectSizeFirst'));
      return;
    }
    setError('');
    const color = product.colors.find((c) => c === colorId)
      ? { id: colorId, name: colorId, hex: '#CCC' }
      : null;
    cart.addItem(product, { color, size, qty });
    setAddedFlash(true);
    setTimeout(() => setAddedFlash(false), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <nav className="mb-8 text-[11px] uppercase tracking-widest text-espresso-300">
        <Link to="/" className="hover:text-espresso-600">Home</Link> ·{' '}
        <span className="text-espresso-500">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="font-display text-3xl leading-tight text-espresso-700 md:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className={`text-xl ${compareAt ? 'text-error' : 'text-espresso-600'}`}>{format(product.price)}</span>
            {compareAt && <span className="text-sm text-espresso-300 line-through">{format(compareAt)}</span>}
            {product.stock <= 5 && (
              <span className="ml-auto text-[10px] uppercase tracking-widest text-warning">Only {product.stock} left</span>
            )}
          </div>

          <p className="mt-5 max-w-lg text-sm leading-relaxed text-espresso-400">{product.description}</p>

          {/* Colour */}
          <div className="mt-8">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso-600">{t('pdp.selectColour')}</p>
            <ColorSelector options={product.colors} value={colorId} onChange={(id) => { setColorId(id); }} />
          </div>

          {/* Size */}
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso-600">{t('pdp.selectSize')}</p>
              <button onClick={() => setSizeGuideOpen(true)} className="text-[11px] uppercase tracking-widest text-gold-600 underline underline-offset-4 hover:text-gold-700">
                {t('pdp.sizeGuide')}
              </button>
            </div>
            <SizeSelector options={product.sizes} value={size} onChange={(s) => { setSize(s); setError(''); }} />
            {error && <p className="mt-2 text-xs text-error">{error}</p>}
          </div>

          {/* Quantity + Add */}
          <div className="mt-8 flex items-center gap-5">
            <QuantitySelector value={qty} onChange={setQty} />
            <Button variant="primary" size="lg" className="flex-1" onClick={handleAdd}>
              {addedFlash ? t('common.added') : t('common.addToBag')}
            </Button>
            <button
              onClick={() => wishlist.toggle(product.id)}
              aria-label="Toggle wishlist"
              className={`flex h-12 w-12 items-center justify-center border transition-all ${
                saved ? 'border-espresso-700 bg-espresso-700 text-gold-400' : 'border-ivory-700 text-espresso-400 hover:border-espresso-500'
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Accordions */}
          <div className="mt-10 divide-y divide-ivory-600 border-y border-ivory-600">
            <details className="group py-4">
              <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso-600 marker:hidden">
                <span className="inline-block transition-transform group-open:rotate-45 mr-2">+</span>{t('pdp.details')}
              </summary>
              <ul className="mt-3 list-disc space-y-1 pl-6 text-sm text-espresso-400">
                {product.tags
                  .filter((tg) => tg.startsWith('fabric:') || tg.startsWith('len:'))
                  .map((tg) => (
                    <li key={tg}>{tg.split(':')[0] === 'fabric' ? 'Fabric' : 'Length'}: {tg.split(':')[1].replace(/-/g, ' ')}</li>
                  ))}
                <li>Dry clean recommended</li>
              </ul>
            </details>
            <details className="py-4">
              <summary className="cursor-pointer list-none text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso-600">
                <span className="mr-2 inline-block">+</span>{t('pdp.shipping')}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-espresso-400">{t('pdp.shippingBody')}</p>
            </details>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 font-display text-2xl text-espresso-700">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Size guide modal */}
      <Modal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} title={t('pdp.sizeGuide')}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ivory-600 text-left text-[10px] uppercase tracking-widest text-espresso-400">
              <th className="pb-2">Size</th><th className="pb-2">Bust</th><th className="pb-2">Waist</th><th className="pb-2">Hips</th>
            </tr>
          </thead>
          <tbody className="text-espresso-500">
            {SIZE_TABLE.map((row) => (
              <tr key={row.size} className="border-b border-ivory-400/50 last:border-0">
                <td className="py-2.5 font-medium">{row.size}</td>
                <td className="py-2.5">{row.bust} cm</td>
                <td className="py-2.5">{row.waist} cm</td>
                <td className="py-2.5">{row.hips} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-xs text-espresso-300">{t('pdp.sizeGuideNote')}</p>
      </Modal>
    </div>
  );
}
