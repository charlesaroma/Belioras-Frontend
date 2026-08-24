export default function Checkbox({ label, checked, onChange, count }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm text-espresso-500 transition-colors hover:text-espresso-700">
      <span
        onClick={(e) => {
          e.preventDefault();
          onChange(!checked);
        }}
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all ${
          checked ? 'border-espresso-700 bg-espresso-700' : 'border-espresso-300 bg-transparent group-hover:border-espresso-500'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-ivory-50" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 6.5L5 9l5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" className="hidden" checked={checked} onChange={() => onChange(!checked)} />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-[11px] text-espresso-200">{count}</span>}
    </label>
  );
}
