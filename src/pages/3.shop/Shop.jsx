import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import FilterDrawer from '../../components/filters/FilterDrawer';
import GridViewSwitcher from '../../components/filters/GridViewSwitcher';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useFilters } from '../../context/FilterContext';
import { filterProducts, sortProducts, searchProducts } from '../../services/productService';
import { useLanguage } from '../../context/LanguageContext';

const SORT_LABELS = {
  featured: 'filters.sortFeatured',
  'price-asc': 'filters.sortPriceLow',
  'price-desc': 'filters.sortPriceHigh',
  newest: 'filters.sortNewest',
};

export default function Shop() {
  const { products: allProducts } = useAdmin();
  const filters = useFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const products = useMemo(() => {
    let list = allProducts;
    const q = searchParams.get('q');
    if (q) list = searchProducts(list, q);
    return sortProducts(filterProducts(list, filters.asFilters), filters.sortBy);
  }, [allProducts, filters.asFilters, filters.sortBy, searchParams]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold-600">The Full Edit</p>
        <h1 className="mt-2 font-display text-4xl text-espresso-700">
          {searchParams.get('q') ? `“${searchParams.get('q')}”` : 'Shop All'}
        </h1>
        <div className="mt-4 h-px w-16 bg-gold-500" />
      </header>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="md:hidden" onClick={() => setDrawerOpen(true)}>
            {t('filters.title')} {filters.activeCount > 0 && `(${filters.activeCount})`}
          </Button>
          <span className="hidden text-xs uppercase tracking-widest text-espresso-300 sm:block">
            {products.length} {t('filters.results')}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-xs text-espresso-400">
            <span className="hidden uppercase tracking-widest sm:inline">{t('filters.sort')}</span>
            <select
              value={filters.sortBy}
              onChange={(e) => filters.setSortBy(e.target.value)}
              className="border border-ivory-700 bg-transparent px-2 py-1.5 text-xs outline-none"
            >
              {Object.keys(SORT_LABELS).map((k) => (
                <option key={k} value={k}>{t(SORT_LABELS[k])}</option>
              ))}
            </select>
          </label>
          <GridViewSwitcher />
        </div>
      </div>

      <ProductGrid products={products} columns={filters.columns} />

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
