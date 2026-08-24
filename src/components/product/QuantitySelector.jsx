export default function QuantitySelector({ value = 1, onChange = () => {}, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-ivory-700">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="px-3.5 py-2 text-espresso-500 transition-colors hover:text-espresso-700 disabled:opacity-30"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-10 text-center font-mono text-sm">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="px-3.5 py-2 text-espresso-500 transition-colors hover:text-espresso-700 disabled:opacity-30"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
