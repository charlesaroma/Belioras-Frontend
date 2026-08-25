import { Link } from 'react-router-dom';

const TILES = [
  {
    to: '/dresses',
    label: 'Category 1',
    sub: 'Collection 2026',
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=900&auto=format&fit=crop',
  },
  {
    to: '/shop/category/prom-gala',
    label: 'Category 2',
    sub: 'Collection 2026',
    img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=900&auto=format&fit=crop',
  },
  {
    to: '/hair/wigs/straight',
    label: 'Category 3',
    sub: 'Collection 2026',
    img: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=900&auto=format&fit=crop',
  },
];

export default function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TILES.map((tile) => (
          <Link
            key={tile.to}
            to={tile.to}
            className="group block"
          >
            {/* Image */}
            <div className="relative overflow-hidden bg-ivory-300">
              <img
                src={tile.img}
                alt={tile.label}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            </div>

            {/* Label below image */}
            <div className="pt-3 pb-1">
              <p className="text-[13px] uppercase tracking-[0.12em] font-sans font-medium text-espresso-700 transition-colors group-hover:text-gold-600">
                {tile.label}
              </p>
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.1em] font-sans text-espresso-300">
                {tile.sub}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
