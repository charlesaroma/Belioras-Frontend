import Drawer from '../common/Drawer';
import FilterAccordion from './FilterAccordion';
import Button from '../common/Button';
import { useFilters } from '../../context/FilterContext';
import { useLanguage } from '../../context/LanguageContext';

export default function FilterDrawer({ open, onClose }) {
  const { priceRange, setPriceRange, clearAll, activeCount } = useFilters();
  const { t } = useLanguage();

  return (
    <Drawer open={open} onClose={onClose} title={t('filters.title')} side="left" width="max-w-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between pb-2">
          <span className="text-[11px] uppercase tracking-[0.22em] text-espresso-400">
            {activeCount} active
          </span>
          <button onClick={clearAll} className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">
            {t('filters.clearAll')}
          </button>
        </div>

        <FilterAccordion />

        {/* Price range */}
        <div className="border-b border-ivory-600 py-5">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-espresso-600">{t('filters.priceRange')}</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Math.max(0, Number(e.target.value)), priceRange[1]])}
              className="w-20 border border-ivory-700 px-2 py-1.5 font-mono text-sm outline-none"
            />
            <span className="text-espresso-300">—</span>
            <input
              type="number"
              min={priceRange[0]}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Math.max(1, Number(e.target.value))])}
              className="w-20 border border-ivory-700 px-2 py-1.5 font-mono text-sm outline-none"
            />
            <span className="text-xs text-espresso-300">€</span>
          </div>
          <input
            type="range"
            min={0}
            max={600}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="mt-4 w-full accent-espresso-700"
          />
        </div>

        <Button variant="primary" size="md" className="mt-6 w-full" onClick={onClose}>
          {t('filters.apply')}
        </Button>
      </div>
    </Drawer>
  );
}
