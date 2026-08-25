import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../context/WishlistContext';

/* Matches the SearchBar result card: image, then name and price
   stacked below. No colour dots. */
export default function ProductCard({ product }) {
  const { format } = useCurrency();
  const wishlist = useWishlist();
  const saved = wishlist.has(product.id);
  const compareAt = product.compareAtPrice && product.compareAtPrice > product.price ? product.compareAtPrice : null;

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

      {/* Name + price stacked below the image */}
      <div className="mt-3">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-sans text-sm leading-snug text-espresso-700 transition-colors group-hover:text-gold-700">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-espresso-400">{format(product.price)}</p>
        {compareAt && (
          <p className="text-xs text-espresso-300 line-through">{format(compareAt)}</p>
        )}
      </div>
    </article>
  );
}
