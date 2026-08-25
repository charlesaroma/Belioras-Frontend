import { useState } from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useDynamicNav } from '../../context/DynamicNavContext';
import Drawer from '../common/Drawer';

/* Drill-down drawer: tapping a parent replaces the list with its
   children + tiles; Login stays pinned at the bottom in both states. */
export default function MobileNav({ open, onClose }) {
  const { items } = useDynamicNav();
  const [activeId, setActiveId] = useState(null);
  const active = (items || []).find((i) => i.id === activeId);

  const handleClose = () => {
    setActiveId(null); // reset drill state so it reopens fresh next time
    onClose();
  };

  const labelOf = (item) =>
    typeof item.label === 'string' ? item.label : item.label?.en || Object.values(item.label || {})[0];

  // Children may be section nodes ({title, items}) or bare links ({label, url})
  const childLinks = active
    ? (active.children || []).flatMap((child) =>
        Array.isArray(child.items) ? child.items.map((sub) => sub) : [child],
      )
    : [];

  return (
    <Drawer open={open} onClose={handleClose} title="Menu" side="left" width="max-w-xs">
      <nav className="flex h-full flex-col px-6 py-6">
        <div className="flex-1 overflow-y-auto">
          {!active ? (
            <ul className="flex flex-col items-center gap-8 pt-10 text-center">
              {(items || []).map((item) => {
                const hasChildren = Boolean(item.children?.length);
                return (
                  <li key={item.id}>
                    {hasChildren ? (
                      <button
                        onClick={() => setActiveId(item.id)}
                        className="inline-flex items-center gap-1 font-sans text-base uppercase tracking-wide text-espresso-700"
                      >
                        {labelOf(item)}
                        <KeyboardArrowRightIcon sx={{ fontSize: 18 }} className="text-espresso-300" />
                      </button>
                    ) : (
                      <Link
                        to={item.url}
                        onClick={handleClose}
                        className="font-sans text-base uppercase tracking-wide text-espresso-700"
                      >
                        {labelOf(item)}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="pt-2">
              <button
                onClick={() => setActiveId(null)}
                className="mb-6 flex items-center gap-2 text-sm text-espresso-400 hover:text-espresso-700"
              >
                <KeyboardBackspaceIcon sx={{ fontSize: 18 }} />
                Back
              </button>

              <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
                {labelOf(active)}
              </p>

              <ul className="flex flex-col items-center gap-5">
                {childLinks.map((sub) => (
                  <li key={sub.id || sub.slug}>
                    <Link to={sub.url} onClick={handleClose} className="text-base text-espresso-700">
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {Boolean(active.tiles?.length) && (
                <div className="mt-10 grid grid-cols-2 gap-4">
                  {active.tiles.map((tile) => (
                    <Link
                      key={tile.id}
                      to={tile.url}
                      onClick={handleClose}
                      className="group relative block aspect-[3/4] overflow-hidden bg-ivory-600"
                    >
                      <img src={tile.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1.5 px-2 text-center">
                        <span className="font-display text-xs uppercase leading-tight tracking-wide text-espresso-800">
                          {typeof tile.title === 'string' ? tile.title : tile.title?.en}
                        </span>
                        <span className="border-b border-espresso-800 pb-0.5 text-[10px] uppercase tracking-widest text-espresso-800">
                          Shop Now
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Login pinned at the bottom in both states */}
        <div className="border-t border-ivory-600 pt-6 text-center">
          <Link to="/login" onClick={handleClose} className="text-base uppercase tracking-wide text-espresso-700">
            Login
          </Link>
        </div>
      </nav>
    </Drawer>
  );
}
