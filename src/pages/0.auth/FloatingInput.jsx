import { useId } from 'react';

const FIELD = 'w-full border-b border-ivory-700 bg-transparent px-0 py-3 text-sm text-espresso-700 outline-none transition-colors focus:border-gold-600';

export default function FloatingInput({ id, label, type = 'text', value, onChange, error, autoComplete, required, rightSlot }) {
  const autoId = useId();
  const inputId = id || autoId;
  const filled = Boolean(value);

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className={`pointer-events-none absolute top-3 text-[11px] font-medium uppercase tracking-widest transition-all duration-200 ${
          filled ? '-translate-y-5 text-[10px] text-espresso-300' : 'text-espresso-200'
        }`}
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={inputId}
          name={inputId}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          required={required}
          className={`${FIELD} ${error ? 'border-error' : ''} ${rightSlot ? 'pr-8' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        {rightSlot && <span className="absolute right-0 flex items-center">{rightSlot}</span>}
      </div>
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
