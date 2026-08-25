import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { useCurrency } from '../../../context/CurrencyContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function WishlistItem({ product }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const { format } = useCurrency();
  const { t } = useLanguage();

  const moveToBag = () => {
    cart.addItem(product, {
      color: product.colors[0]
        ? { id: product.colors[0], name: product.colors[0], hex: '#CCC' }
        : null,
      size: product.sizes[0],
      qty: 1,
    });
    wishlist.remove(product.id);
  };

  return (
    <article className="group relative border border-ivory-600 bg-ivory-100">
      <Link to={`/product/${product.slug}`} className="block overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <button
        onClick={() => wishlist.toggle(product.id)}
        aria-label="Remove from wishlist"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-espresso-800/80 text-gold-400 backdrop-blur transition hover:text-error"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="p-4">
        <h3 className="font-display text-base text-espresso-700">{product.name}</h3>
        <p className="mt-1 text-sm text-espresso-500">{format(product.price)}</p>
        <Button variant="outline" size="sm" className="mt-4 w-full" onClick={moveToBag}>
          {t('wishlist.moveToBag')}
        </Button>
      </div>
    </article>
  );
}
