import { useCurrency } from '../../context/CurrencyContext';

export default function CurrencySelector({ className = '' }) {
  const { code, setCode, currencies } = useCurrency();

  return (
    <label className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-widest ${className}`}>
      <select
        value={code}
        onChange={(e) => setCode(e.target.value)}
        aria-label="Currency"
        className="cursor-pointer bg-transparent py-1 pr-1 outline-none transition-colors hover:text-gold-600"
      >
        {currencies.map((c) => (
          <option key={c.code} value={c.code} className="text-espresso-700">
            {c.symbol} {c.code}
          </option>
        ))}
      </select>
    </label>
  );
}
