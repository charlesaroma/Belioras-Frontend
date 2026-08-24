import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDynamicNav } from '../../context/DynamicNavContext';
import Drawer from '../common/Drawer';

export default function MobileNav({ open, onClose }) {
  const { items } = useDynamicNav();
  const [expanded, setExpanded] = useState(null);

  return (
    <Drawer open={open} onClose={onClose} title="Menu" side="left" width="max-w-xs">
      <nav className="px-6 py-4">
        <ul className="divide-y divide-ivory-600">
          {items.map((item) => {
            const hasChildren = item.children.length > 0;
            const isExpanded = expanded === item.id;
            return (
              <li key={item.id} className="py-1">
                <div className="flex items-center justify-between">
                  {hasChildren ? (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className="flex-1 py-3 text-left font-display text-base tracking-wide text-espresso-700"
                    >
                      {typeof item.label === 'string' ? item.label : item.label.en}
                    </button>
                  ) : (
                    <Link to={item.url} onClick={onClose} className="flex-1 py-3 font-display text-base tracking-wide text-espresso-700">
                      {typeof item.label === 'string' ? item.label : item.label.en}
                    </Link>
                  )}
                  {hasChildren && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : item.id)}
                      className={`p-2 text-espresso-300 transition-transform ${isExpanded ? 'rotate-45' : ''}`}
                      aria-label="Expand"
                    >
                      +
                    </button>
                  )}
                </div>
                {hasChildren && isExpanded && (
                  <div className="space-y-5 pb-4">
                    {(item.children || []).map((section) => (
                      <div key={section.id}>
                        {section.title && (
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-600">{section.title}</p>
                        )}
                        <ul className="space-y-2 pl-1">
                          {(section.items || []).map((sub) => (
                            <li key={sub.id || sub.slug}>
                              <Link to={sub.url} onClick={onClose} className="text-sm text-espresso-400 hover:text-espresso-700">
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </Drawer>
  );
}
