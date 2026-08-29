import { useCurrency } from '../../context/CurrencyContext';
import DropdownPill from './DropdownPill';

export default function CurrencySelector({ className = '' }) {
  const { code, setCode, currencies } = useCurrency();
  const active = currencies.find((c) => c.code === code);

  return (
    <div className={className}>
      <DropdownPill
        ariaLabel="Currency"
        activeCode={code}
        onSelect={setCode}
        label={
          <>
            {active?.symbol} <span className="hidden sm:inline">{code}</span>
          </>
        }
        options={currencies.map((c) => ({ code: c.code, display: `${c.symbol} ${c.code}` }))}
      />
    </div>
  );
}
