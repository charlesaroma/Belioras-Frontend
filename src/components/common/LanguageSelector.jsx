import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSelector({ className = '' }) {
  const { lang, setLang, locales } = useLanguage();

  return (
    <label className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-widest ${className}`}>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        aria-label="Language"
        className="cursor-pointer bg-transparent py-1 pr-1 outline-none transition-colors hover:text-gold-600"
      >
        {locales.map((l) => (
          <option key={l.code} value={l.code} className="text-espresso-700">
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
