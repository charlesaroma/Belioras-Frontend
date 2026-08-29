import { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import clsx from 'clsx';
import { useDynamicNav } from '../../context/DynamicNavContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import Drawer from '../common/Drawer';
import MegaMenuAccordion from './MegaMenuAccordion';
import { PILL, PILL_ACTIVE, PILL_INACTIVE } from './navStyles';

/* Same accordion the desktop mega-menu uses (MegaMenuAccordion), just
   expanded in place instead of floating — identical at mobile & tablet
   widths since both share this one component below the `lg` breakpoint. */
export default function MobileNav({ open, onClose }) {
  const { items } = useDynamicNav();
  const { code, setCode, currencies } = useCurrency();
  const { lang, setLang, locales } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);

  const handleClose = () => {
    setExpandedId(null); // collapse so it reopens fresh next time
    onClose();
  };

  const labelOf = (item) =>
    typeof item.label === 'string' ? item.label : item.label?.en || Object.values(item.label || {})[0];

  return (
    <Drawer open={open} onClose={handleClose} title="Menu" side="left" width="max-w-xs">
      <nav className="flex h-full flex-col px-6 py-6">
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-1 pt-4">
            {(items || []).map((item) => {
              const hasChildren = Boolean(item.children?.length || item.tiles?.length);
              const isOpen = expandedId === item.id;
              return (
                <li key={item.id} className="border-b border-ivory-600 last:border-b-0">
                  {hasChildren ? (
                    <>
                      <div className="flex items-center">
                        <Link
                          to={item.url}
                          onClick={handleClose}
                          className="flex-1 py-4 font-sans text-base uppercase tracking-wide text-espresso-700"
                        >
                          {labelOf(item)}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isOpen ? null : item.id)}
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${labelOf(item)}`}
                          className="flex items-center justify-center p-4 -m-2"
                        >
                          <KeyboardArrowDownIcon
                            sx={{ fontSize: 20 }}
                            className={`text-espresso-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </div>
                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        }`}
                      >
                        <div className="min-h-0 overflow-hidden pb-6">
                          {isOpen && <MegaMenuAccordion item={item} onNavigate={handleClose} />}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to={item.url}
                      onClick={handleClose}
                      className="block py-4 font-sans text-base uppercase tracking-wide text-espresso-700"
                    >
                      {labelOf(item)}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Currency / language + Login pinned at the bottom */}
        <div className="border-t border-ivory-600 pt-6 text-center">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
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

          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
            {locales.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                aria-pressed={l.code === lang}
                className={clsx(PILL, l.code === lang ? PILL_ACTIVE : PILL_INACTIVE)}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link to="/login" onClick={handleClose} className="text-base uppercase tracking-wide text-espresso-700">
            Login
          </Link>
        </div>
      </nav>
    </Drawer>
  );
}
