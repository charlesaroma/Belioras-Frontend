import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import clsx from 'clsx';
import { useLanguage } from '../../context/LanguageContext';
import DropdownPill from './DropdownPill';
import { ICON_BUTTON } from '../layout/navStyles';

export default function LanguageSelector({ className = '', iconOnly = false }) {
  const { lang, setLang, locales } = useLanguage();

  return (
    <div className={className}>
      <DropdownPill
        ariaLabel="Language"
        activeCode={lang}
        onSelect={setLang}
        icon={<TranslateOutlinedIcon fontSize="small" />}
        label={iconOnly ? null : lang.toUpperCase()}
        showChevron={!iconOnly}
        triggerClassName={iconOnly ? clsx('flex items-center justify-center', ICON_BUTTON) : undefined}
        options={locales.map((l) => ({ code: l.code, display: l.label }))}
      />
    </div>
  );
}
