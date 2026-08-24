import { useLocation, Link } from 'react-router-dom';
import { useDynamicNav } from '../../context/DynamicNavContext';

function flatten(items, acc = []) {
  for (const item of items) {
    acc.push(item);
    if (item.children?.length) flatten(item.children, acc);
  }
  return acc;
}

export default function SubcategoryDropdown() {
  const { items } = useDynamicNav();
  const { pathname } = useLocation();

  // Find the top-level nav item whose subtree contains the current path.
  const parent = items.find((item) => {
    const urls = [item.url, ...flatten(item.children || []).map((c) => c.url)];
    return pathname.startsWith(item.url + '/') && urls.includes(pathname);
  });

  if (!parent) return null;

  const siblings = (parent.children || []).flatMap((section) => section.items || []);

  return (
    <div className="flex flex-wrap gap-2">
      {siblings.map((sub) => {
        const active = sub.url === pathname;
        return (
          <Link
            key={sub.id}
            to={sub.url}
            className={`border px-3.5 py-1.5 text-[11px] uppercase tracking-widest transition-colors ${
              active
                ? 'border-espresso-700 bg-espresso-700 text-ivory-50'
                : 'border-ivory-700 text-espresso-400 hover:border-espresso-500 hover:text-espresso-700'
            }`}
          >
            {sub.label}
          </Link>
        );
      })}
    </div>
  );
}
