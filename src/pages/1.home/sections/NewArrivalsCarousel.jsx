import { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../../components/product/ProductCard';
import { useAdmin } from '../../../context/AdminContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function NewArrivalsCarousel() {
  const { products } = useAdmin();
  const { t } = useLanguage();
  const scrollRef = useRef(null);

  const arrivals = [...products]
    .filter((p) => p.tags.includes('tag:new'))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 300;
    el.scrollBy({ left: dir * (cardWidth + 20), behavior: 'smooth' });
  };

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
      {/* Heading */}
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl text-espresso-700">
          {t('home.newArrivalsTitle')}
        </h2>
        <div className="mx-auto mt-3 h-px w-12 bg-gold-500" />
      </div>

      {/* Carousel wrapper with arrow buttons */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous"
          className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10
            flex h-9 w-9 items-center justify-center rounded-full
            bg-ivory-50 border border-ivory-600 shadow-sm
            text-espresso-500 hover:text-espresso-700 hover:border-espresso-400
            transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-1"
        >
          {arrivals.map((p) => (
            <div
              key={p.id}
              className="w-[75%] shrink-0 snap-start sm:w-[48%] lg:w-[23%]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          aria-label="Next"
          className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10
            flex h-9 w-9 items-center justify-center rounded-full
            bg-ivory-50 border border-ivory-600 shadow-sm
            text-espresso-500 hover:text-espresso-700 hover:border-espresso-400
            transition-all duration-200"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* View More CTA */}
      <div className="mt-10 flex justify-center">
        <Link
          to="/whats-new"
          className="inline-block border border-espresso-700 px-10 py-3
            text-[11px] uppercase tracking-[0.22em] font-sans font-medium text-espresso-700
            transition-colors duration-200
            hover:bg-espresso-700 hover:text-ivory-50"
        >
          View More
        </Link>
      </div>
    </section>
  );
}
