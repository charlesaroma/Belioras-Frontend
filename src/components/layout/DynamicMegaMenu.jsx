import { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useDynamicNav } from '../../context/DynamicNavContext';
import { useLanguage } from '../../context/LanguageContext';

const ACCORDION_THRESHOLD = 1; // accordions once a menu has >1 section

/* Uniform mega-menu frame: text lists on the left, large image tiles
   on the right. Children support two shapes:
   - bare link node  { label, url }            → plain standalone row
   - section node    { title, items: [...] }   → accordion when grouped */
export default function DynamicMegaMenu() {
  const { hoveredItem } = useDynamicNav();
  const { lang } = useLanguage();
  const [openSection, setOpenSection] = useState(null);

  if (!hoveredItem) return null;

  const labelOf = (node) =>
    typeof node === 'string' ? node : node?.[lang] || node?.en;

  const bareLinks = [];
  const sections = [];
  (hoveredItem.children || []).forEach((child) => {
    if (Array.isArray(child.items)) sections.push(child);
    else if (child.url) bareLinks.push(child);
  });

  const hasTiles = Boolean(hoveredItem.tiles?.length);
  const useAccordions = sections.length > ACCORDION_THRESHOLD;
  if (!bareLinks.length && !sections.length && !hasTiles) return null;

  const toggleSection = (id) => setOpenSection((cur) => (cur === id ? null : id));

  return (
    <div className="border-t border-ivory-600 bg-ivory-50 shadow-xl">
      <div className="mx-auto flex max-w-[1400px] items-stretch gap-10 px-6 py-14 lg:gap-16 lg:px-10">
        {/* Left — links & accordions */}
        <div className="w-[220px] shrink-0 xl:w-[300px]">
          {/* Standalone links (e.g., DRESSES: Mini / Midi / Maxi / Prom & Gala) */}
          {bareLinks.length > 0 && (
            <ul className="space-y-3.5">
              {bareLinks.map((sub) => (
                <li key={sub.id || sub.slug}>
                  <Link
                    to={sub.url}
                    className="font-sans text-base text-espresso-700 transition-colors hover:text-gold-600"
                  >
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {/* Section groups */}
          {useAccordions ? (
            <div className={bareLinks.length ? 'mt-8' : ''}>
              {sections.map((section, idx) => {
                const isOpen = openSection === section.id || (openSection === null && idx === 0);
                return (
                  <div key={section.id} className="border-b border-ivory-400/70 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between py-4 text-left"
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                        {labelOf(section.title)}
                      </span>
                      <KeyboardArrowDownIcon
                        sx={{ fontSize: 18 }}
                        className={`shrink-0 text-espresso-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {/* Grid-rows trick animates height smoothly without measuring */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <ul className="min-h-0 space-y-3 overflow-hidden">
                        {(section.items || []).map((sub) => (
                          <li key={sub.id || sub.slug}>
                            <Link
                              to={sub.url}
                              tabIndex={isOpen ? 0 : -1}
                              className="block py-0.5 font-sans text-sm text-espresso-500 transition-colors hover:text-gold-600"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                        {/* Spacer keeps breathing room while collapsed-safe */}
                        <li aria-hidden className="h-2" />
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className={bareLinks.length ? 'mt-8' : ''}>
                {section.title && (
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">
                    {labelOf(section.title)}
                  </p>
                )}
                <ul className="space-y-3.5">
                  {(section.items || []).map((sub) => (
                    <li key={sub.id || sub.slug}>
                      <Link
                        to={sub.url}
                        className="font-sans text-sm text-espresso-500 transition-colors hover:text-gold-600"
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Right — full-size image tiles */}
        {hasTiles && (
          <div className="grid flex-1 grid-cols-2 gap-6 self-start">
            {hoveredItem.tiles.map((tile) => (
              <Link
                key={tile.id}
                to={tile.url}
                className="group relative block aspect-[3/4] overflow-hidden bg-ivory-600"
              >
                <img
                  src={tile.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 px-2 text-center">
                  <span className="font-display text-xl uppercase leading-tight tracking-wide text-espresso-800">
                    {typeof tile.title === 'string' ? tile.title : labelOf(tile.title)}
                  </span>
                  <span className="border-b border-espresso-800 pb-0.5 text-xs uppercase tracking-widest text-espresso-800">
                    Shop Now
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
