import { Link } from 'react-router-dom';
import WishlistGrid from './sections/WishlistGrid';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Wishlist() {
  const wishlist = useWishlist();
  const { products } = useAdmin();
  const { t } = useLanguage();

  const savedProducts = products.filter((p) => wishlist.ids.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <h1 className="font-display text-4xl text-espresso-700">{t('wishlist.title')}</h1>
        <p className="mt-2 text-sm text-espresso-400">{savedProducts.length} saved</p>
        <div className="mt-4 h-px w-16 bg-gold-500" />
      </header>

      {savedProducts.length === 0 ? (
        <div className="flex flex-col items-center gap-5 border border-ivory-600 bg-ivory-100 py-24 text-center">
          <svg viewBox="0 0 24 24" className="h-12 w-12 text-espresso-200" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" strokeLinejoin="round" />
          </svg>
          <h2 className="font-display text-xl text-espresso-700">{t('wishlist.emptyTitle')}</h2>
          <p className="max-w-xs text-sm text-espresso-400">{t('wishlist.emptyMsg')}</p>
          <Link to="/new-arrivals">
            <Button variant="outline" size="sm">{t('wishlist.browse')}</Button>
          </Link>
        </div>
      ) : (
        <WishlistGrid products={savedProducts} />
      )}
    </div>
  );
}
