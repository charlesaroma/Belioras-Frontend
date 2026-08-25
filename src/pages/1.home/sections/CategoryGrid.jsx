import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

const TILES = [
  { to: '/dresses', label: 'Dresses', img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900&auto=format&fit=crop' },
  { to: '/shop/category/prom-gala', label: 'Prom & Gala', img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop' },
  { to: '/hair/wigs/straight', label: 'Wigs', img: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=900&auto=format&fit=crop' },
  { to: '/accessories/shoes/heels', label: 'Heels', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=900&auto=format&fit=crop' },
];

export default function CategoryGrid() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl text-espresso-700">{t('home.categoriesTitle')}</h2>
        <div className="mx-auto mt-3 h-px w-16 bg-gold-500" />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TILES.map((tile) => (
          <Link key={tile.to} to={tile.to} className="group relative block overflow-hidden">
            <img
              src={tile.img}
              alt={tile.label}
              loading="lazy"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/60 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 font-display text-lg tracking-wide text-ivory-50 transition-colors group-hover:text-champagne-300">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
