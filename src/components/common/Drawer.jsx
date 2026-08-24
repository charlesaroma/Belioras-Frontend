import { useEffect } from 'react';

export default function Drawer({ open, onClose, title, side = 'right', width = 'max-w-md', children }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const isRight = side === 'right';
  const translateClass = open ? 'translate-x-0' : isRight ? 'translate-x-full' : '-translate-x-full';

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-espresso-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        role="dialog"
        className={`absolute top-0 ${isRight ? 'right-0' : 'left-0'} h-full w-full ${width} bg-ivory-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${translateClass}`}
      >
        <header className="flex items-center justify-between border-b border-ivory-600 px-6 py-5">
          <h2 className="font-display text-lg tracking-wide text-espresso-700 uppercase">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-espresso-400 transition hover:text-espresso-700 text-xl leading-none"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </div>
  );
}
