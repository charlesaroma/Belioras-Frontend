import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const MESSAGES = {
  en: ['Complimentary express shipping over €200', '30-day free returns within the EU', 'New: The AW26 Occasion Edit'],
  fr: ['Livraison express offerte dès 200 €', 'Retours gratuits sous 30 jours dans l’UE', 'Nouveau : l’Édit Cérémonie AW26'],
};

const AUTO_HIDE_MS = 6000;

/* Home-page-only announcement ticker: auto-dismisses after a few
   seconds, messages drifting left with dot separators. */
export default function TopBar() {
  const { lang } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Derive-and-reset during render (React-endorsed pattern): re-arm the
  // banner each time we arrive home, without setState-in-effect.
  const [state, setState] = useState({ home: isHome, dismissed: false });
  if (state.home !== isHome) {
    setState({ home: isHome, dismissed: false });
  }
  const visible = state.home && !state.dismissed;

  useEffect(() => {
    if (!isHome || state.dismissed) return undefined;
    const timer = setTimeout(() => setState((s) => ({ ...s, dismissed: true })), AUTO_HIDE_MS);
    return () => clearTimeout(timer);
  }, [isHome, state.dismissed]);

  if (!isHome) return null;

  // Duplicate the sequence so the -50% translate loops seamlessly
  const items = [...(MESSAGES[lang] || MESSAGES.en), ...(MESSAGES[lang] || MESSAGES.en)];

  return (
    <div
      className={`overflow-hidden bg-espresso-800 transition-all duration-700 ease-in-out ${
        visible ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="py-2">
        <div className="flex w-max animate-[marquee-left_28s_linear_infinite] items-center whitespace-nowrap">
          {items.map((message, i) => (
            <span key={i} className="flex items-center">
              <span className="px-8 text-[10px] uppercase tracking-[0.25em] text-champagne-300">
                {message}
              </span>
              <span aria-hidden className="text-[10px] text-gold-400">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
