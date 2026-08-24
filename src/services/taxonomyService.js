import { DATA } from './jsonDataLoader';

export function taxonomyTypes() {
  return Object.keys(DATA.attributes);
}

export function getValues(attributes = DATA.attributes, type) {
  return attributes[type]?.values || [];
}

export function getLabel(attributes = DATA.attributes, type, lang = 'en') {
  const label = attributes[type]?.label;
  if (!label) return type;
  return typeof label === 'string' ? label : label[lang] || label.en;
}

export function findById(attributes = DATA.attributes, type, id) {
  return getValues(attributes, type).find((v) => v.id === id) || null;
}

export function colorHex(attributes, colorId) {
  return findById(attributes, 'color', colorId)?.hex || '#CCCCCC';
}

export function sizeName(attributes, sizeId) {
  return findById(attributes, 'size', sizeId)?.name || String(sizeId).toUpperCase();
}

export function categoryLabel(slug, lang = 'en') {
  const entry = DATA.categoryLabels[slug];
  if (!entry) return slug;
  return entry[lang] || entry.en;
}

export function navItemLabel(item, lang = 'en') {
  if (!item) return '';
  if (typeof item.label === 'string') return item.label;
  return item.label[lang] || item.label.en;
}
