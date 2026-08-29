import { useState, useId } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function DropdownPill({ ariaLabel, label, options, activeCode, onSelect }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        className="inline-flex items-center gap-1 rounded-full border border-current/30 px-3 py-1 text-[11px] uppercase tracking-widest transition-colors hover:border-current/60"
      >
        {label}
        <KeyboardArrowDownIcon
          sx={{ fontSize: 14 }}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <ul
            id={listId}
            role="listbox"
            aria-label={ariaLabel}
            className="absolute right-0 z-50 mt-2 max-h-64 w-40 overflow-y-auto rounded-2xl border border-ivory-600 bg-ivory-50 py-1 text-espresso-700 shadow-lg"
          >
            {options.map((opt) => (
              <li key={opt.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt.code === activeCode}
                  onClick={() => { onSelect(opt.code); setOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-xs uppercase tracking-wide transition-colors hover:bg-ivory-200 ${
                    opt.code === activeCode ? 'text-gold-700' : 'text-espresso-700'
                  }`}
                >
                  {opt.display}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
