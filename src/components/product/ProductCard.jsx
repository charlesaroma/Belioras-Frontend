import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAdmin } from '../../context/AdminContext';

export default function ProductCard({ product }) {
  const { format } = useCurrency();
  const wishlist = useWishlist();
  const { attributes } = useAdmin();
  const saved = wishlist.has(product.id);
  const compareAt = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice : null;

  const swatches = (product.colors || []).slice(0, 4).map((id) => {
    const c = attributes.color.values.find((v) => v.id === id) || {};
    return { id, hex: c.hex || '#CCC', name: c.name || id };
  });

  return (
    <article className="group relative">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden bg-ivory-200">
        <div className="aspect-[3/4] w-full">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-0"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full aspect-[3/4] w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
        </div>
        {compareAt && (
          <span className="absolute left-3 top-3 bg-espresso-800 px-2 py-1 text-[9px] uppercase tracking-widest text-champagne-300">
            Sale
          </span>
        )}
        {product.tags.includes('tag:new') && !compareAt && (
          <span className="absolute left-3 top-3 bg-ivory-50 px-2 py-1 text-[9px] uppercase tracking-widest text-gold-600">New</span>
        )}
      </Link>

      {/* Wishlist heart */}
      <button
        onClick={() => wishlist.toggle(product.id)}
        aria-label="Toggle wishlist"
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all ${
          saved ? 'bg-espresso-800/80 text-gold-400' : 'bg-ivory-50/80 text-espresso-500 hover:text-espresso-700'
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/product/${product.slug}`} className="flex-1">
            <h3 className="font-display text-base leading-snug text-espresso-700 transition-colors group-hover:text-gold-700">
              {product.name}
            </h3>
          </Link>
          <div className="text-right">
            <p className="whitespace-nowrap text-sm text-espresso-600">{format(product.price)}</p>
            {compareAt && <p className="whitespace-nowrap text-xs text-espresso-300 line-through">{format(compareAt)}</p>}
          </div>
        </div>
        {swatches.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5">
            {swatches.map((s) => (
              <span key={s.id} title={s.name} className="h-3.5 w-3.5 rounded-full border border-ivory-700" style={{ backgroundColor: s.hex }} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
