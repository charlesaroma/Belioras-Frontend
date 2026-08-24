import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProductGrid from '../../components/product/ProductGrid';
import FilterDrawer from '../../components/filters/FilterDrawer';
import GridViewSwitcher from '../../components/filters/GridViewSwitcher';
import SubcategoryDropdown from '../../components/filters/SubcategoryDropdown';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useFilters } from '../../context/FilterContext';
import { resolveNavTokens, matchByTokens, sortProducts, filterProducts } from '../../services/productService';
import { categoryLabel, navItemLabel } from '../../services/taxonomyService';
import { useLanguage } from '../../context/LanguageContext';

function findNavItem(items, url) {
  for (const item of items) {
    if (item.url === url) return item;
    const found = (item.children || []).flatMap((s) => s.items || []).find((c) => c.url === url);
    if (found) return { ...found, parentLabel: typeof item.label === 'string' ? item.label : navItemLabel(item, 'en') };
  }
  return null;
}

export default function CategoryPage() {
  const { pathname } = useLocation();
  const { products: allProducts, navigation } = useAdmin();
  const filters = useFilters();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { lang } = useLanguage();

  const slug = pathname.replace(/^\//, '');

  const products = useMemo(() => {
    const tokens = resolveNavTokens(slug);
    const matched = matchByTokens(allProducts, tokens);
    return sortProducts(filterProducts(matched, filters.asFilters), filters.sortBy);
  }, [slug, allProducts, filters.asFilters, filters.sortBy]);

  const navItem = useMemo(() => findNavItem(navigation?.items || [], pathname), [navigation, pathname]);
  const title = useMemo(() => {
    if (navItem?.label) return typeof navItem.label === 'string' ? navItem.label : navItem.label[lang] || navItem.label.en;
    const lastSegment = slug.split('/').pop() || slug;
    return categoryLabel(lastSegment, lang);
  }, [navItem, slug, lang]);

  const breadcrumbParent = navItem?.parentLabel;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-8">
        <nav className="mb-3 text-[11px] uppercase tracking-widest text-espresso-300">
          <Link to="/" className="hover:text-espresso-600">Home</Link>
          {breadcrumbParent && <> · <span>{breadcrumbParent}</span></>}
          <> · <span className="text-espresso-500">{title}</span></>
        </nav>
        <h1 className="font-display text-4xl text-espresso-700">{title}</h1>
        <div className="mt-4 h-px w-16 bg-gold-500" />
      </header>

      <div className="mb-6"><SubcategoryDropdown /></div>

      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="md:hidden" onClick={() => setDrawerOpen(true)}>
            Filters {filters.activeCount > 0 && `(${filters.activeCount})`}
          </Button>
          <span className="hidden text-xs uppercase tracking-widest text-espresso-300 sm:block">
            {products.length} pieces
          </span>
        </div>
        <GridViewSwitcher />
      </div>

      <ProductGrid products={products} columns={filters.columns} />

      <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  );
}
