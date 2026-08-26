import { COLUMN_OPTIONS, useFilters } from '../../context/FilterContext';

/* Grid-density control using the design PNGs from /public/icons:
   default/active art pairs per view mode (2/3/4/6 columns + row). */
export default function GridViewSwitcher() {
  const { columns, setColumns } = useFilters();

  return (
    <div className="hidden items-center gap-1 border border-ivory-700 p-1 md:flex" aria-label="Grid density">
      {COLUMN_OPTIONS.map((option) => {
        const key = option === 'row' ? 'row' : option;
        const active = columns === option;
        return (
          <button
            key={key}
            onClick={() => setColumns(option)}
            aria-label={option === 'row' ? 'Row layout' : `${option} columns`}
            aria-pressed={active}
            title={option === 'row' ? 'Row layout' : `${option} columns`}
            className={`p-1 transition-opacity ${active ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
          >
            <img
              src={`/icons/grid-${key}-${active ? 'active' : 'default'}.png`}
              alt=""
              className="h-[26px] w-auto"
              draggable="false"
            />
          </button>
        );
      })}
    </div>
  );
}
