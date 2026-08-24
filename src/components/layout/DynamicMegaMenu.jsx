import { useDynamicNav } from '../../context/DynamicNavContext';
import { useLanguage } from '../../context/LanguageContext';

function FlyoutColumn({ section }) {
  return (
    <div className="min-w-[180px]">
      {section.title && (
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">{section.title}</p>
      )}
      <ul className="space-y-2.5">
        {(section.items || []).map((item) => (
          <li key={item.id || item.slug}>
            <a
              href={item.url}
              className="text-sm text-espresso-400 transition-colors duration-150 hover:text-espresso-700"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DynamicMegaMenu() {
  const { hoveredItem, hasFlyout } = useDynamicNav();
  const { lang } = useLanguage();

  if (!hasFlyout) return null;

  const title = typeof hoveredItem.label === 'string' ? hoveredItem.label : hoveredItem.label[lang];

  return (
    <div
      onMouseEnter={() => {}}
      className="absolute inset-x-0 top-full border-t border-ivory-600 bg-ivory-50 shadow-xl"
    >
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-baseline gap-4">
          <span className="font-display text-2xl text-espresso-700">{title}</span>
          <a href={hoveredItem.url} className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">
            View all →
          </a>
        </div>
        <div className={`grid gap-x-12 gap-y-8 ${(hoveredItem.children || []).length > 2 ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-1 md:grid-cols-2'}`}>
          {(hoveredItem.children || []).map((section) => (
            <FlyoutColumn key={section.id} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
}
