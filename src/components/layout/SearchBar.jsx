import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { searchProducts } from '../../services/productService';
import { colorHex, sizeName, taxonomyTypes } from '../../services/taxonomyService';

const DEFAULT_RESULT_COUNT = 6;

function ResultCard({ product, onNavigate }) {
  const { format } = useCurrency();
  return (
    <Link to={`/product/${product.slug}`} onClick={onNavigate} className="group block">
      <div className="aspect-[3/4] overflow-hidden bg-ivory-600">
        <img
          src={product.images?.[0]}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-3 font-sans text-sm text-espresso-700 group-hover:text-gold-700">{product.name}</p>
      <p className="text-sm text-espresso-400">{format(product.price)}</p>
    </Link>
  );
}

export default function SearchBar({ onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { products, attributes } = useAdmin();

  const [query, setQuery] = useState('');
  const [selectedColours, setSelectedColours] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [panelTop, setPanelTop] = useState(64);
  const rootRef = useRef(null);

  /* Swatches/sizes derived from the real catalog so filters always
     match actual inventory values (lowercase ids in product arrays). */
  const colourSwatches = useMemo(() => {
    if (!taxonomyTypes().includes('color')) return [];
    return [...new Set(products.flatMap((p) => p.colors || []))].map((id) => ({
      id,
      hex: colorHex(attributes, id),
    }));
  }, [products, attributes]);

  const sizeChips = useMemo(() => {
    if (!taxonomyTypes().includes('size')) return [];
    return [...new Set(products.flatMap((p) => p.sizes || []))].map((id) => ({
      id,
      name: sizeName(attributes, id),
    }));
  }, [products, attributes]);

  const syncPanelPosition = useCallback(() => {
    const header = rootRef.current?.closest('header');
    if (header) setPanelTop(header.getBoundingClientRect().bottom);
  }, []);

  const close = useCallback(() => {
    setQuery('');
    setSelectedColours(new Set());
    setSelectedSizes(new Set());
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    const onClickAway = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [close]);

  useEffect(() => {
    syncPanelPosition();
    window.addEventListener('scroll', syncPanelPosition, { passive: true });
    return () => window.removeEventListener('scroll', syncPanelPosition);
  }, [syncPanelPosition]);

  const trimmed = query.trim();
  const hasQuery = Boolean(trimmed);

  // Base results: live matches while typing; a default spread of the
  // catalog when opening so the panel is never empty.
  const baseResults = useMemo(
    () => (hasQuery ? searchProducts(products, trimmed) : products.slice(0, DEFAULT_RESULT_COUNT)),
    [products, trimmed, hasQuery],
  );

  // Colour/size filters layer on top of the base set.
  const filteredResults = useMemo(
    () =>
      baseResults.filter((p) => {
        const colourOk =
          selectedColours.size === 0 || (p.colors || []).some((c) => selectedColours.has(c));
        const sizeOk =
          selectedSizes.size === 0 || (p.sizes || []).some((s) => selectedSizes.has(s));
        return colourOk && sizeOk;
      }),
    [baseResults, selectedColours, selectedSizes],
  );

  const suggestions = useMemo(() => {
    if (!hasQuery) return [];
    return [...new Set(baseResults.map((p) => p.name))].slice(0, 4);
  }, [baseResults, hasQuery]);

  const toggleSet = (setter) => (value) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  const toggleColour = toggleSet(setSelectedColours);
  const toggleSize = toggleSet(setSelectedSizes);

  const submitSearch = () => {
    if (!hasQuery) return;
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    close();
  };

  const notFound = hasQuery && filteredResults.length === 0;

  return (
    <div ref={rootRef} className="relative">
      <div
        className="fixed inset-x-0 z-50 max-h-[85vh] overflow-y-auto border-b border-ivory-600 bg-ivory-50 shadow-xl"
        style={{ top: panelTop }}
        role="search"
      >
        <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
          {/* Input row — boxed search field, close button outside on the same line */}
          <div className="flex items-center gap-4">
            <div className="flex flex-1 items-center gap-3 border border-espresso-300 px-4 py-3">
              <SearchOutlinedIcon sx={{ fontSize: 18 }} className="shrink-0 text-espresso-300" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submitSearch();
                  if (e.key === 'Escape') close();
                }}
                placeholder={t('common.searchPlaceholder')}
                className="flex-1 bg-transparent py-0.5 text-sm tracking-wide outline-none placeholder:text-espresso-300"
              />
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close search"
              className="flex shrink-0 items-center gap-1 text-xs uppercase tracking-widest text-espresso-400 hover:text-espresso-700"
            >
              <CloseIcon sx={{ fontSize: 14 }} />
              <span className="hidden sm:inline">Close Search</span>
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 border-b border-ivory-400 py-4 text-sm">
              <span className="font-semibold text-espresso-700">Search Suggestions</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="text-brown-600 underline underline-offset-2 hover:text-gold-600"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Filters + Results */}
          <div className="grid grid-cols-1 gap-8 pt-6 lg:grid-cols-[220px_1fr]">
            <div className="flex flex-row gap-10 lg:flex-col lg:gap-8">
              {colourSwatches.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-espresso-700">Colour</p>
                  <div className="flex max-w-[180px] flex-wrap gap-2">
                    {colourSwatches.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleColour(c.id)}
                        aria-label={c.id}
                        aria-pressed={selectedColours.has(c.id)}
                        className={`h-7 w-7 border transition-all ${
                          selectedColours.has(c.id)
                            ? 'ring-2 ring-gold-500 ring-offset-1'
                            : 'border-ivory-700'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {sizeChips.length > 0 && (
                <div>
                  <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-espresso-700">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizeChips.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSize(s.id)}
                        aria-pressed={selectedSizes.has(s.id)}
                        className={`flex h-8 min-w-[32px] items-center justify-center border px-1.5 text-xs transition-all ${
                          selectedSizes.has(s.id)
                            ? 'border-gold-500 ring-1 ring-gold-500 text-espresso-700'
                            : 'border-ivory-700 text-espresso-500'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              {!notFound && (
                <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-espresso-700">Results</p>
              )}

              {notFound ? (
                <div className="flex min-h-[200px] items-center justify-center bg-ivory-200 px-4 text-center">
                  <p className="text-espresso-400">
                    We didn&rsquo;t find anything for &ldquo;{trimmed}&rdquo;
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {filteredResults.map((product) => (
                    <ResultCard key={product.id} product={product} onNavigate={close} />
                  ))}
                </div>
              )}

              {hasQuery && !notFound && (
                <button
                  type="button"
                  onClick={submitSearch}
                  className="mt-8 block text-left text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700"
                >
                  View all results for &ldquo;{trimmed}&rdquo; →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
