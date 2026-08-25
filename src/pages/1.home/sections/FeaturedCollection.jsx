import { Link } from 'react-router-dom';
import ProductGrid from '../../../components/product/ProductGrid';
import { useAdmin } from '../../../context/AdminContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function FeaturedCollection() {
  const { products } = useAdmin();
  const { t } = useLanguage();

  const featured = products.filter((p) => p.tags.includes('tag:featured')).slice(0, 4);

  return (
    <section className="bg-ivory-200 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl text-espresso-700">{t('home.featuredTitle')}</h2>
            <p className="mt-2 text-sm text-espresso-400">{t('home.featuredSub')}</p>
          </div>
          <Link to="/best-sellers" className="hidden text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700 md:block">
            {t('common.viewAll')} →
          </Link>
        </div>
        <ProductGrid products={featured} columns={4} />
      </div>
    </section>
  );
}
