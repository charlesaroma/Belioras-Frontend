import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const shopLinks = [
    { to: '/new-arrivals', label: 'New Arrivals' },
    { to: '/shop/category/mini-dresses', label: 'Mini Dresses' },
    { to: '/shop/category/maxi-dresses', label: 'Maxi Dresses' },
    { to: '/hair/wigs/straight', label: 'Wigs' },
    { to: '/accessories/shoes/heels', label: 'Heels' },
  ];
  const helpLinks = ['shipping', 'returns', 'sizeGuide', 'contact', 'faq'].map((k) => ({ label: t(`footer.links.${k}`) }));
  const houseLinks = ['about', 'sustainability', 'careers', 'stores'].map((k) => ({ label: t(`footer.links.${k}`) }));

  const renderList = (links, withLinks = false) => (
    <ul className="space-y-2.5">
      {links.map((l, i) => (
        <li key={i}>
          {withLinks && l.to ? (
            <Link to={l.to} className="text-sm text-espresso-400 transition-colors hover:text-espresso-700">
              {l.label}
            </Link>
          ) : (
            <a href="#" className="text-sm text-espresso-400 transition-colors hover:text-espresso-700">
              {l.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="mt-24 border-t border-ivory-600 bg-ivory-200">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        {/* Newsletter */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-lg text-espresso-700">{t('footer.newsletterTitle')}</h3>
          <p className="mt-3 text-sm leading-relaxed text-espresso-400">{t('footer.newsletterSub')}</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex border border-espresso-300">
            <input
              type="email"
              required
              placeholder={t('footer.emailPlaceholder')}
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-espresso-200"
            />
            <button type="submit" className="bg-espresso-700 px-4 py-2.5 text-[10px] uppercase tracking-widest text-ivory-50 transition-colors hover:bg-espresso-500">
              {t('footer.subscribe')}
            </button>
          </form>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-700">{t('footer.shopCol')}</h4>
          {renderList(shopLinks, true)}
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-700">{t('footer.helpCol')}</h4>
          {renderList(helpLinks)}
        </div>
        <div>
          <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-700">{t('footer.companyCol')}</h4>
          {renderList(houseLinks)}
        </div>
      </div>

      <div className="border-t border-ivory-600">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-[11px] uppercase tracking-widest text-espresso-300 md:flex-row">
          <p>{t('footer.rights')}</p>
          <p className="font-mono">Paris · London · Lagos</p>
        </div>
      </div>
    </footer>
  );
}
