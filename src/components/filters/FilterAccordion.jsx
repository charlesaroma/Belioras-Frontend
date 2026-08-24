import { useState } from 'react';
import Checkbox from '../common/Checkbox';
import { useAdmin } from '../../context/AdminContext';
import { useFilters } from '../../context/FilterContext';
import { getLabel } from '../../services/taxonomyService';
import { useLanguage } from '../../context/LanguageContext';

const DIMENSIONS = ['color', 'size', 'fabric', 'occasion', 'style', 'hair'];
const I18N_KEY = {
  color: 'filters.colour',
  size: 'filters.size',
  fabric: 'filters.fabric',
  occasion: 'filters.occasion',
  style: 'filters.style',
  hair: 'filters.hair',
};

function AccordionSection({ dimension, open, onToggle }) {
  const { attributes } = useAdmin();
  const { activeTags, toggleTag } = useFilters();
  const { t, lang } = useLanguage();

  const values = attributes[dimension]?.values || [];
  if (!values.length) return null;

  const selected = activeTags[dimension];

  return (
    <div className="border-b border-ivory-600 py-4">
      <button onClick={onToggle} className="flex w-full items-center justify-between text-left">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${selected.length ? 'text-gold-700' : 'text-espresso-600'}`}>
          {t(I18N_KEY[dimension]) || getLabel(attributes, dimension, lang)}
        </span>
        <span className={`text-espresso-400 transition-transform duration-200 ${open ? '' : '-rotate-90'}`}>⌄</span>
      </button>
      {open && (
        <div className="mt-3 grid grid-cols-2 gap-x-4">
          {values.map((v) => (
            <Checkbox
              key={v.id}
              label={
                dimension === 'color' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-ivory-700" style={{ backgroundColor: v.hex }} />
                    {v.name}
                  </span>
                ) : (
                  v.name
                )
              }
              checked={selected.includes(v.id)}
              onChange={() => toggleTag(dimension, v.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterAccordion() {
  const [openSections, setOpenSections] = useState({ color: true });

  return (
    <div>
      {DIMENSIONS.map((dim) => (
        <AccordionSection
          key={dim}
          dimension={dim}
          open={Boolean(openSections[dim])}
          onToggle={() => setOpenSections((s) => ({ ...s, [dim]: !s[dim] }))}
        />
      ))}
    </div>
  );
}
