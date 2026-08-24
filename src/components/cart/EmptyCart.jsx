import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';

export default function EmptyCart() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-20 text-center">
      <svg viewBox="0 0 24 24" className="h-12 w-12 text-espresso-200" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M6 8h12l-1 13H7L6 8z" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      <h3 className="font-display text-xl text-espresso-700">{t('cart.emptyTitle')}</h3>
      <p className="max-w-60 text-sm text-espresso-400">{t('cart.emptyMsg')}</p>
      <Link to="/new-arrivals">
        <Button variant="outline" size="sm">{t('common.shopNow')}</Button>
      </Link>
    </div>
  );
}
