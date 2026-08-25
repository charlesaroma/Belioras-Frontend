import { DATA } from '../../../services/jsonDataLoader';
import { useLanguage } from '../../../context/LanguageContext';

export default function InstagramFeed() {
  const { t } = useLanguage();

  return (
    <section className="bg-espresso-900 py-16">
      {/* Heading */}
      <div className="mb-8 text-center px-6">
        <p className="text-[10px] uppercase tracking-[0.3em] font-sans text-champagne-500 mb-2">
          Follow us
        </p>
        <h2 className="font-display text-2xl md:text-3xl text-ivory-100">
          {t('home.instaTitle')}
        </h2>
        <p className="mt-2 text-xs text-ivory-700">
          {t('home.instaSub')}
        </p>
      </div>

      {/* 3-column grid (matches mockup) */}
      <div className="grid grid-cols-3">
        {DATA.instagram.slice(0, 3).map((post) => (
          <a
            key={post.id}
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className="group relative block overflow-hidden bg-espresso-800"
          >
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.06] opacity-80 group-hover:opacity-100"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-espresso-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ivory-50" fill="currentColor">
                <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" />
              </svg>
              <span className="text-sm font-medium text-ivory-50">
                {post.likes?.toLocaleString()}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
