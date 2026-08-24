import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDynamicNav } from '../../context/DynamicNavContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import MobileNav from './MobileNav';
import DynamicMegaMenu from './DynamicMegaMenu';

function Badge({ count }) {
  if (!count) return null;
  return (
    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 text-[9px] font-semibold text-espresso-800">
      {count}
    </span>
  );
}

export default function Navbar() {
  const { items, hoveredId, setHoveredId } = useDynamicNav();
  const cart = useCart();
  const wishlist = useWishlist();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const submitSearch = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    setQuery('');
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const linkClass = ({ isActive }) =>
    `relative py-4 text-[11px] font-medium uppercase tracking-[0.25em] transition-colors duration-200 hover:text-espresso-700 ${
      isActive ? 'text-gold-600' : 'text-espresso-500'
    }`;

  return (
    <header
      className="sticky top-0 z-40 border-b border-ivory-600 bg-ivory-50/95 backdrop-blur"
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between gap-6">
          <button className="text-espresso-600 md:hidden" onClick={() => setMobileOpen(true)} aria-label={t('nav.menu')}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/" className="shrink-0 font-display text-xl tracking-[0.35em] text-espresso-700 md:text-2xl">
            BELIORA
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {items.map((item) => (
              <NavLink
                key={item.id}
                to={item.url}
                end={item.children.length === 0}
                className={linkClass}
                onMouseEnter={() => setHoveredId(item.id)}
              >
                {typeof item.label === 'string' ? item.label : item.label[lang] || item.label.en}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-5 text-espresso-600">
            <button onClick={() => setSearchOpen((v) => !v)} aria-label={t('nav.search')} className="transition-colors hover:text-gold-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
            <Link to="/wishlist" aria-label={t('nav.wishlist')} className="relative transition-colors hover:text-gold-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" strokeLinejoin="round" />
              </svg>
              <Badge count={wishlist.count} />
            </Link>
            <button onClick={cart.openDrawer} aria-label={t('nav.cart')} className="relative transition-colors hover:text-gold-600">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 8h12l-1 13H7L6 8z" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              <Badge count={cart.count} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-ivory-600 py-3">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('common.searchPlaceholder')}
              className="w-full bg-transparent px-2 py-1 text-sm tracking-wide outline-none placeholder:text-espresso-200"
            />
          </form>
        )}
      </div>

      <div className="relative hidden md:block">
        {items.some((item) => item.id === hoveredId && item.children.length > 0) && <DynamicMegaMenu />}
      </div>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
