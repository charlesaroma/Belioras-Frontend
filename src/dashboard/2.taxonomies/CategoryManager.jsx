import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { categoryLabel } from '../../services/taxonomyService';

export default function CategoryManager() {
  const { categories, addCategory, removeCategory } = useAdmin();
  const [newSlug, setNewSlug] = useState('');
  const [parent, setParent] = useState('shop');

  const slug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const exists = categories.some((c) => c.slug === slug);

  const add = (e) => {
    e.preventDefault();
    if (!slug || exists) return;
    addCategory({ slug, parent: parent || null });
    setNewSlug('');
  };

  return (
    <div>
      <h2 className="font-display text-xl text-espresso-700">Categories</h2>
      <p className="mb-6 mt-1 text-xs text-espresso-400">Category slugs power storefront URLs like /shop/&lt;slug&gt;.</p>

      <form onSubmit={add} className="mb-6 flex flex-wrap gap-3">
        <input
          value={newSlug}
          onChange={(e) => setNewSlug(e.target.value)}
          placeholder="new-category-slug"
          className="w-56 border border-ivory-700 bg-ivory-50 px-3 py-2 font-mono text-sm outline-none focus:border-gold-600"
        />
        <select value={parent} onChange={(e) => setParent(e.target.value)} className="border border-ivory-700 bg-ivory-50 px-3 py-2 text-sm outline-none">
          <option value="">— top level —</option>
          {categories.filter((c) => !c.parent || c.parent === 'shop').map((c) => (
            <option key={c.slug} value={c.slug}>{categoryLabel(c.slug)}</option>
          ))}
        </select>
        <button
          type="submit"
          disabled={!slug || exists}
          className="border border-espresso-700 px-4 text-[11px] uppercase tracking-widest text-espresso-700 transition-colors hover:bg-espresso-700 hover:text-ivory-50 disabled:opacity-30"
        >
          Add
        </button>
        {exists && <span className="self-center text-[11px] text-error">Slug already exists</span>}
      </form>

      <ul className="divide-y divide-ivory-600 border border-ivory-600 bg-ivory-50">
        {categories.map((c) => (
          <li key={c.slug} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-baseline gap-3">
              {c.parent && <span className="text-espresso-200">└</span>}
              <span className={`text-sm ${c.parent ? 'text-espresso-400' : 'font-medium text-espresso-600'}`}>{categoryLabel(c.slug)}</span>
              <span className="font-mono text-[10px] text-espresso-200">{c.slug}</span>
            </div>
            {!['new-arrivals', 'shop', 'dresses', 'hair', 'accessories'].includes(c.slug) && (
              <button
                onClick={() => window.confirm(`Remove “${c.slug}”?`) && removeCategory(c.slug)}
                className="text-xs text-espresso-300 transition-colors hover:text-error"
              >
                ✕
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
