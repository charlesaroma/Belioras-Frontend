import { useState } from 'react';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';

const FIELD = 'w-full border border-ivory-700 bg-ivory-50 px-3 py-2.5 text-sm outline-none focus:border-gold-600';
const LABEL = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso-500';

export default function StoreSettings() {
  const { resetToDefaults } = useAdmin();
  const { code, setCode, baseCurrency, rates } = useCurrency();
  const { lang, setLang } = useLanguage();
  const [storeName, setStoreName] = useState('Maison Beliora');
  const [freeShipThreshold, setFreeShipThreshold] = useState(200);
  const [savedFlash, setSavedFlash] = useState(false);
  const [maintenance, setMaintenance] = useState(false);

  const save = (e) => {
    e.preventDefault();
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1800);
  };

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-espresso-700">Store Settings</h1>
      </header>

      <form onSubmit={save} className="space-y-8">
        <section className="border border-ivory-600 bg-ivory-50 p-6">
          <h2 className="mb-4 font-display text-lg text-espresso-700">General</h2>
          <label className={LABEL}>Store name</label>
          <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className={FIELD} />

          <label className={`${LABEL} mt-5`}>Free shipping threshold (EUR)</label>
          <input type="number" min="0" value={freeShipThreshold} onChange={(e) => setFreeShipThreshold(Number(e.target.value))} className={FIELD} />
        </section>

        <section className="border border-ivory-600 bg-ivory-50 p-6">
          <h2 className="mb-4 font-display text-lg text-espresso-700">Localization defaults</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Default currency</label>
              <select value={code} onChange={(e) => setCode(e.target.value)} className={FIELD}>
                {Object.keys(rates).map((c) => <option key={c}>{c}</option>)}
              </select>
              <p className="mt-1.5 font-mono text-[10px] text-espresso-200">base: {baseCurrency}</p>
            </div>
            <div>
              <label className={LABEL}>Default language</label>
              <select value={lang} onChange={(e) => setLang(e.target.value)} className={FIELD}>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-espresso-300">Changes apply to your current session immediately.</p>
        </section>

        <section className="border border-ivory-600 bg-ivory-50 p-6">
          <h2 className="mb-4 font-display text-lg text-espresso-700">Danger zone</h2>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="mt-1 accent-espresso-700" />
            <span>
              <span className="block text-sm font-medium text-espresso-600">Maintenance banner</span>
              <span className="text-xs text-espresso-300">Show a “back soon” note on the storefront top bar.</span>
            </span>
          </label>

          <div className="mt-6 border-t border-ivory-600 pt-5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => window.confirm('Reset all products, taxonomies and navigation to factory defaults?') && resetToDefaults()}
              className="text-error hover:text-error"
            >
              Reset demo data to defaults
            </Button>
            <p className="mt-1.5 text-[11px] text-espresso-300">Clears every dashboard edit stored in localStorage.</p>
          </div>
        </section>

        <div className="flex items-center gap-4">
          {savedFlash && <span className="animate-pulse text-xs font-medium text-success">Settings saved ✓</span>}
          <Button type="submit" variant="primary">Save settings</Button>
        </div>
      </form>
    </div>
  );
}
