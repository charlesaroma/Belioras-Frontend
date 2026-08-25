import { Link } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';

// Fallback images if no featured products exist
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=900&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop',
];

export default function FeaturedCollection() {
  const { products } = useAdmin();

  const featured = products.filter((p) => p.tags.includes('tag:featured')).slice(0, 4);

  // Build 4 image slots — use product images or fallbacks
  const images = Array.from({ length: 4 }, (_, i) =>
    featured[i]?.images?.[0] || FALLBACK_IMAGES[i],
  );
  const slugs = Array.from({ length: 4 }, (_, i) =>
    featured[i]?.slug ? `/product/${featured[i].slug}` : '/shop',
  );

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-10">
      {/* 2×2 grid with centred overlay label */}
      <div className="relative grid grid-cols-2 gap-1">
        {images.map((src, i) => (
          <Link
            key={i}
            to={slugs[i]}
            className="group block overflow-hidden bg-ivory-300"
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </Link>
        ))}

        {/* Centred overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-ivory-50/90 backdrop-blur-[2px] px-8 py-5 flex flex-col items-center text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-espresso-300 mb-2">
              Curated for you
            </p>
            <p className="font-display text-xl md:text-2xl text-espresso-700 leading-tight italic">
              Featured
            </p>
            <p className="font-display text-xl md:text-2xl text-espresso-700 leading-tight italic">
              Collection
            </p>
            <div className="mt-3 h-px w-12 bg-gold-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
