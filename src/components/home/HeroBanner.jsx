import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function HeroBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[78vh] min-h-[520px] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=2000&auto=format&fit=crop"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-espresso-900/70 via-espresso-900/20 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-end px-6 pb-20 text-ivory-50">
        <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-champagne-300">{t('home.heroKicker')}</p>
        <h1 className="whitespace-pre-line font-display text-5xl leading-[1.05] md:text-7xl">{t('home.heroTitle')}</h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory-100/85">{t('home.heroSub')}</p>
        <div className="mt-8 flex gap-4">
          <Link to="/new-arrivals">
            <Button variant="gold" size="lg">{t('home.heroCta')}</Button>
          </Link>
          <Link to="/shop">
            <Button variant="ghost" size="lg" className="border border-ivory-100/60 text-ivory-50 hover:bg-ivory-50 hover:text-espresso-800">
              {t('common.shopNow')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
