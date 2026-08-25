import { DATA } from '../../../services/jsonDataLoader';
import { useLanguage } from '../../../context/LanguageContext';

export default function InstagramFeed() {
  const { t } = useLanguage();

  return (
    <section className="pb-24">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl text-espresso-700">{t('home.instaTitle')}</h2>
        <p className="mt-2 text-sm text-espresso-400">{t('home.instaSub')}</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6">
        {DATA.instagram.map((post) => (
          <a key={post.id} href={post.url} target="_blank" rel="noreferrer" className="group relative block overflow-hidden bg-ivory-200">
            <img
              src={post.image}
              alt=""
              loading="lazy"
              className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-espresso-900/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-ivory-50" fill="currentColor">
                <path d="M12 21s-7.5-4.6-9.6-9A5.4 5.4 0 0 1 12 6.6 5.4 5.4 0 0 1 21.6 12c-2.1 4.4-9.6 9-9.6 9z" />
              </svg>
              <span className="text-sm font-medium text-ivory-50">{post.likes.toLocaleString()}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
