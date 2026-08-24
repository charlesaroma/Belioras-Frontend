import { useLanguage } from '../../context/LanguageContext';
import LanguageSelector from '../common/LanguageSelector';
import CurrencySelector from '../common/CurrencySelector';

const MESSAGES = {
  en: ['Complimentary express shipping over €200', '30-day free returns within the EU', 'New: The AW26 Occasion Edit'],
  fr: ['Livraison express offerte dès 200 €', 'Retours gratuits sous 30 jours dans l’UE', 'Nouveau : l’Édit Cérémonie AW26'],
};

export default function TopBar() {
  const { lang } = useLanguage();
  const message = MESSAGES[lang]?.[new Date().getDate() % 3] || MESSAGES.en[0];

  return (
    <div className="bg-espresso-800 text-ivory-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2">
        <p className="flex-1 truncate text-[10px] uppercase tracking-[0.25em] text-champagne-300">{message}</p>
        <div className="ml-4 flex items-center gap-3">
          <CurrencySelector className="text-ivory-100" />
          <span className="text-espresso-400">|</span>
          <LanguageSelector className="text-ivory-100" />
        </div>
      </div>
    </div>
  );
}
