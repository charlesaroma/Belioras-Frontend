import { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function AttributeManager() {
  const { attributes, addAttributeValue, removeAttributeValue } = useAdmin();
  const [activeTab, setActiveTab] = useState('color');
  const [draft, setDraft] = useState({ name: '', hex: '' });

  const tabs = Object.keys(attributes);
  const values = attributes[activeTab]?.values || [];

  const add = (e) => {
    e.preventDefault();
    if (!draft.name.trim()) return;
    const id = draft.name.trim().toLowerCase().replace(/\s+/g, '-');
    if (values.some((v) => v.id === id)) return;
    const value = { id, name: draft.name.trim() };
    if (activeTab === 'color' && draft.hex) value.hex = draft.hex;
    addAttributeValue(activeTab, value);
    setDraft({ name: '', hex: '' });
  };

  return (
    <div>
      <h2 className="font-display text-xl text-espresso-700">Attributes</h2>
      <p className="mb-6 mt-1 text-xs text-espresso-400">
        Edits propagate to the storefront filter drawer, PDP selectors and product tagging instantly.
      </p>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-ivory-600">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setDraft({ name: '', hex: '' }); }}
            className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-gold-500 text-espresso-700'
                : 'text-espresso-300 hover:text-espresso-600'
            }`}
          >
            {attributes[tab]?.label?.en || tab} ({attributes[tab].values.length})
          </button>
        ))}
      </div>

      <form onSubmit={add} className="mb-6 flex flex-wrap items-center gap-3">
        <input
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          placeholder={`New ${activeTab} name…`}
          className="w-52 border border-ivory-700 bg-ivory-50 px-3 py-2 text-sm outline-none focus:border-gold-600"
        />
        {activeTab === 'color' && (
          <label className="flex items-center gap-2 border border-ivory-700 px-2 py-1.5">
            <input type="color" value={draft.hex || '#cccccc'} onChange={(e) => setDraft((d) => ({ ...d, hex: e.target.value }))} className="h-6 w-8 cursor-pointer bg-transparent" />
            <span className="font-mono text-xs text-espresso-400">{draft.hex || '#cccccc'}</span>
          </label>
        )}
        <button type="submit" className="border border-espresso-700 px-4 py-2 text-[11px] uppercase tracking-widest text-espresso-700 transition-colors hover:bg-espresso-700 hover:text-ivory-50">
          Add value
        </button>
      </form>

      <div className="flex flex-wrap gap-2 border border-ivory-600 bg-ivory-50 p-4">
        {values.map((v) => (
          <span key={v.id} className="group inline-flex items-center gap-2 rounded-full border border-ivory-700 bg-ivory-100 py-1 pl-3 pr-1.5 text-xs text-espresso-500">
            {activeTab === 'color' && (
              <span className="h-3 w-3 rounded-full border border-ivory-700" style={{ backgroundColor: v.hex }} />
            )}
            {v.name}
            <button
              onClick={() => window.confirm(`Remove “${v.name}”?`) && removeAttributeValue(activeTab, v.id)}
              className="flex h-5 w-5 items-center justify-center rounded-full text-espresso-300 transition-colors hover:bg-error hover:text-ivory-50"
            >
              ✕
            </button>
          </span>
        ))}
        {!values.length && <p className="py-4 text-sm text-espresso-300">No values yet.</p>}
      </div>
    </div>
  );
}
