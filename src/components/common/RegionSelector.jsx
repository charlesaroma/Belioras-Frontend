import { useState } from 'react';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import clsx from 'clsx';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { ICON_BUTTON, PILL, PILL_ACTIVE, PILL_INACTIVE } from '../layout/navStyles';

export default function RegionSelector({ className = '' }) {
  const [open, setOpen] = useState(false);
  const { code, setCode, currencies } = useCurrency();
  const { lang, setLang, locales } = useLanguage();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Currency and language"
        className={clsx('flex items-center justify-center', ICON_BUTTON, className)}
      >
        <PublicOutlinedIcon fontSize="small" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-3 w-56 space-y-4 rounded-2xl border border-ivory-600 bg-ivory-50 p-4 text-espresso-700 shadow-lg">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-espresso-300">Currency</p>
              <div className="flex flex-wrap gap-2">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCode(c.code)}
                    aria-pressed={c.code === code}
                    className={clsx(PILL, c.code === code ? PILL_ACTIVE : PILL_INACTIVE)}
                  >
                    {c.symbol} {c.code}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[10px] uppercase tracking-widest text-espresso-300">Language</p>
              <div className="flex flex-wrap gap-2">
                {locales.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setLang(l.code)}
                    aria-pressed={l.code === lang}
                    className={clsx(PILL, l.code === lang ? PILL_ACTIVE : PILL_INACTIVE)}
                  >
                    {l.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
