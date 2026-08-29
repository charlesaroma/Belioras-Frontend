import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const MESSAGES = {
  en: ['Complimentary express shipping over €200', '30-day free returns within the EU', 'New: The AW26 Occasion Edit'],
  fr: ['Livraison express offerte dès 200 €', 'Retours gratuits sous 30 jours dans l’UE', 'Nouveau : l’Édit Cérémonie AW26'],
};

/* Home-page-only announcement ticker: stays put until the user
   dismisses it, messages drifting left with dot separators. */
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

  if (!isHome) return null;

  // Duplicate the sequence so the -50% translate loops seamlessly
  const items = [...(MESSAGES[lang] || MESSAGES.en), ...(MESSAGES[lang] || MESSAGES.en)];

  return (
    <div
      className={`relative z-50 overflow-hidden bg-espresso-800 transition-all duration-700 ease-in-out ${
        visible ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className="relative py-2 pr-10">
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

        <button
          type="button"
          onClick={() => setState((s) => ({ ...s, dismissed: true }))}
          aria-label="Dismiss announcement"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-champagne-300 transition-colors hover:text-white"
        >
          <svg viewBox="0 0 16 16" width="10" height="10" fill="none" aria-hidden="true">
            <path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
