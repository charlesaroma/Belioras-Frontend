import { TABLET_COLUMN_OPTIONS, DESKTOP_COLUMN_OPTIONS, useFilters } from '../../context/FilterContext';

/* Grid-density control using the design PNGs from /public/icons.
   Tablet (md–lg) shows row/2/3; large screens show 2/4/6. */
function IconGroup({ options, className }) {
  const { columns, setColumns } = useFilters();

  return (
    <div className={className}>
      {options.map((option) => {
        const key = option === 'row' ? 'row' : option;
        const active = columns === option;
        return (
          <button
            key={key}
            onClick={() => setColumns(option)}
            aria-label={option === 'row' ? 'Row layout' : `${option} columns`}
            aria-pressed={active}
            title={option === 'row' ? 'Row layout' : `${option} columns`}
            className={`cursor-pointer p-1 transition-opacity ${active ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
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

export default function GridViewSwitcher() {
  return (
    <div aria-label="Grid density">
      <IconGroup options={TABLET_COLUMN_OPTIONS} className="flex gap-1 lg:hidden" />
      <IconGroup options={DESKTOP_COLUMN_OPTIONS} className="hidden gap-1 lg:flex" />
    </div>
  );
}
