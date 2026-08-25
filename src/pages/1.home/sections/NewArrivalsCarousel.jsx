import { Link } from 'react-router-dom';
import ProductCard from '../../../components/product/ProductCard';
import { useAdmin } from '../../../context/AdminContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function NewArrivalsCarousel() {
  const { products } = useAdmin();
  const { t } = useLanguage();

  const arrivals = [...products]
    .filter((p) => p.tags.includes('tag:new'))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl text-espresso-700">{t('home.newArrivalsTitle')}</h2>
        <Link to="/new-arrivals" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">
          {t('common.viewAll')} →
        </Link>
      </div>

      <div className="no-scrollbar -mx-6 flex snap-x gap-5 overflow-x-auto px-6 pb-2">
        {arrivals.map((p) => (
          <div key={p.id} className="w-[70%] shrink-0 snap-start sm:w-[45%] lg:w-[23.5%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
