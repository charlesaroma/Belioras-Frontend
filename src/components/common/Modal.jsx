import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog">
      <div className="absolute inset-0 bg-espresso-900/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative w-full ${width} bg-ivory-50 shadow-2xl`}>
        <header className="flex items-center justify-between border-b border-ivory-600 px-6 py-4">
          <h3 className="font-display text-lg tracking-wide text-espresso-700">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="text-espresso-400 hover:text-espresso-700">
            ✕
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
