import { Link } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';

/*
 * Editorial hero section — headline, subline and CTA beneath the
 * full-bleed HeroBanner. Text comes from the language strings
 * (home.heroKicker / heroTitle / heroSub / heroCta).
 */
export default function Hero() {
  const { t } = useLanguage();
  const titleLines = t('home.heroTitle').split('\n');

  return (
    <section className="bg-ivory-50">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] font-sans font-medium text-gold-600">
          {t('home.heroKicker')}
        </p>

        <h1 className="mt-6 font-display text-4xl md:text-6xl leading-tight text-espresso-700">
          {titleLines.map((line) => (
            <span key={line} className="block">{line}</span>
          ))}
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-sm md:text-base tracking-wide text-espresso-500">
          {t('home.heroSub')}
        </p>

        <Link
          to="/shop"
          className="group mt-10 inline-flex items-center gap-2 border-b border-gold-500 pb-1 text-[12px] uppercase tracking-[0.2em] font-sans font-medium text-espresso-700 transition-colors hover:text-gold-700"
        >
          {t('home.heroCta')}
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </section>
  );
}
