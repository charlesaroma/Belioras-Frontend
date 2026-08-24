import languagesData from '../data/languages.json';

function resolvePath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function t(key, lang = 'en') {
  const value = resolvePath(languagesData.strings[lang], key) ?? resolvePath(languagesData.strings.en, key);
  return typeof value === 'string' ? value : key;
}

export function locales() {
  return languagesData.locales;
}
