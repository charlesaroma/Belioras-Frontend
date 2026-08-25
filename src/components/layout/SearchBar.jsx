import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { searchProducts } from '../../services/productService';

const MAX_SUGGESTIONS = 6;

/* Live results dropdown — product hits as you type */
function SuggestionList({ query, onNavigate, onViewAll }) {
  const { products } = useAdmin();
  const { format } = useCurrency();
  const trimmed = query.trim();

  const matches = useMemo(() => (trimmed ? searchProducts(products, trimmed) : []), [products, trimmed]);

  if (trimmed && matches.length === 0) {
    return (
      <p className="px-6 py-5 text-sm text-espresso-300">
        No pieces match “{trimmed}” — try a colour, fabric or occasion.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-ivory-400/60">
      {matches.slice(0, MAX_SUGGESTIONS).map((product) => (
        <li key={product.id}>
          <Link
            to={`/product/${product.slug}`}
            onClick={onNavigate}
            className="group flex items-center gap-4 px-6 py-3 transition-colors hover:bg-champagne-50"
          >
            <img src={product.images[0]} alt="" className="h-16 w-12 shrink-0 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm text-espresso-700 group-hover:text-gold-700">{product.name}</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {product.tags
                  .filter((tag) => tag.startsWith('fabric:') || tag.startsWith('len:') || tag.startsWith('occ:'))
                  .slice(0, 3)
                  .map((tag) => (
                    <span key={tag} className="rounded-full bg-ivory-200 px-2 py-0.5 text-[9px] uppercase tracking-widest text-espresso-400">
                      {tag.split(':')[1].replace(/-/g, ' ')}
                    </span>
                  ))}
              </div>
            </div>
            <span className="shrink-0 text-sm text-espresso-500">{format(product.price)}</span>
          </Link>
        </li>
      ))}
      {matches.length > 0 && (
        <li>
          <button
            type="button"
            onClick={onViewAll}
            className="block w-full border-t border-ivory-600 px-6 py-3.5 text-left text-[11px] uppercase tracking-widest text-gold-600 transition-colors hover:bg-ivory-200 hover:text-gold-700"
          >
            View all {matches.length} result{matches.length === 1 ? '' : 's'} for “{trimmed}” →
          </button>
        </li>
      )}
    </ul>
  );
}

/*
 * Self-contained live search: trigger icon, expanding input and
 * instant suggestion dropdown. The panel is rendered fixed and
 * dynamically anchored to sit flush beneath the site header.
 */
export default function SearchBar() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [panelTop, setPanelTop] = useState(64);
  const rootRef = useRef(null);

  const syncPanelPosition = useCallback(() => {
    const header = rootRef.current?.closest('header');
    if (header) setPanelTop(header.getBoundingClientRect().bottom);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  /* Close on click-away */
  useEffect(() => {
    if (!open) return undefined;
    const onClickAway = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [open, close]);

  /* Keep panel glued under the header while scrolling */
  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener('scroll', syncPanelPosition, { passive: true });
    return () => window.removeEventListener('scroll', syncPanelPosition);
  }, [open, syncPanelPosition]);

  const toggle = () => {
    setOpen((v) => {
      if (!v) syncPanelPosition();
      else setQuery('');
      return !v;
    });
  };

  const submitSearch = () => {
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    close();
  };

  const hasQuery = Boolean(query.trim());

  return (
    <div ref={rootRef} className="relative">
      <button onClick={toggle} aria-label={t('nav.search')} aria-expanded={open} className="transition-colors hover:text-gold-600">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <form
          onSubmit={(e) => e.preventDefault()}
          className="fixed inset-x-0 z-50 border-b border-ivory-600 bg-ivory-50 shadow-xl"
          style={{ top: panelTop }}
          role="search"
        >
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-3 border-b border-ivory-400/60 px-6 py-3.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-espresso-300" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') close();
                  if (e.key === 'Enter') submitSearch();
                }}
                placeholder={t('common.searchPlaceholder')}
                className="flex-1 bg-transparent py-1 text-sm tracking-wide outline-none placeholder:text-espresso-200"
              />
              {hasQuery && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="shrink-0 text-xs text-espresso-300 hover:text-espresso-600"
                >
                  ✕
                </button>
              )}
              {hasQuery && (
                <button
                  type="button"
                  onClick={submitSearch}
                  className="shrink-0 text-[10px] uppercase tracking-widest text-gold-600 hover:text-gold-700"
                >
                  All results ↵
                </button>
              )}
            </div>

            {hasQuery ? (
              <div className="max-h-[60vh] overflow-y-auto">
                <SuggestionList query={query} onNavigate={close} onViewAll={submitSearch} />
              </div>
            ) : null}
          </div>
        </form>
      )}
    </div>
  );
}
