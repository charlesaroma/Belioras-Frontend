import { useLanguage } from '../../context/LanguageContext';
import DropdownPill from './DropdownPill';

export default function LanguageSelector({ className = '' }) {
  const { lang, setLang, locales } = useLanguage();

  return (
    <div className={className}>
      <DropdownPill
        ariaLabel="Language"
        activeCode={lang}
        onSelect={setLang}
        label={lang.toUpperCase()}
        options={locales.map((l) => ({ code: l.code, display: l.label }))}
      />
    </div>
  );
}
