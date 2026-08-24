/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../services/jsonDataLoader';
import { t as translate, locales } from '../utils/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => loadJSON(STORAGE_KEYS.language, 'en'));

  useEffect(() => {
    saveJSON(STORAGE_KEYS.language, lang);
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      locales: locales(),
      t: (key) => translate(key, lang),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
