import { COLUMN_OPTIONS, useFilters } from '../../context/FilterContext';

function ColumnsIcon({ n, active }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${active ? 'fill-current' : 'fill-none'} stroke-current`} strokeWidth="1.4">
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={3 + i * (18 / n)} y="5" width={16 / n - 1} height="14" rx="0.5" />
      ))}
    </svg>
  );
}

export default function GridViewSwitcher() {
  const { columns, setColumns } = useFilters();

  return (
    <div className="hidden items-center gap-1 border border-ivory-700 p-1 md:flex" aria-label="Grid density">
      {COLUMN_OPTIONS.map((n) => (
        <button
          key={n}
          onClick={() => setColumns(n)}
          aria-label={`${n} columns`}
          title={`${n} columns`}
          className={`p-1.5 transition-colors ${columns === n ? 'bg-espresso-700 text-ivory-50' : 'text-espresso-400 hover:text-espresso-700'}`}
        >
          <ColumnsIcon n={n} active={false} />
        </button>
      ))}
    </div>
  );
}
