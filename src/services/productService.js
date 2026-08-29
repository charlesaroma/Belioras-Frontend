const CATEGORY_TOKENS = {
  'mini-dresses': ['len:mini'],
  'midi-dresses': ['len:midi'],
  'maxi-dresses': ['len:maxi'],
  'prom-gala': ['occ:prom', 'occ:gala'],
  jumpsuits: ['cat:jumpsuits'],
  'two-piece-sets': ['cat:two-piece-sets'],
  'formal-wear': ['occ:formal'],
  'coats-jackets': ['cat:coats-jackets'],
};

const OCCASION_TOKENS = [
  'occ:birthday', 'occ:party', 'occ:cocktail', 'occ:wedding-guest', 'occ:evening', 'occ:gala', 'occ:prom', 'occ:formal',
];

export function resolveNavTokens(slug) {
  const parts = String(slug || '').split('/').filter(Boolean);
  const [head, second, third] = parts;

  if (slug === 'new-arrivals/catalog') return ['tag:new'];
  if (slug === 'new-arrivals/collections') return ['tag:featured'];
  if (head === 'new-arrivals') return ['tag:new'];

  if (head === 'shop' && second === 'category') return CATEGORY_TOKENS[third] || [`cat:${third}`];
  if (head === 'shop' && second === 'occasion') return third ? [`occ:${third}`] : OCCASION_TOKENS;
  if (head === 'shop' && second === 'style') return [`style:${third}`];
  if (head === 'shop' && second === 'fabric') return [`fabric:${third}`];
  if (head === 'shop' && second === 'color') {
    if (third === 'monochrome') return ['color:black', 'color:white'];
    return [`color:${third}`];
  }

  if (head === 'dresses') return ['cat:dresses'];

  if (head === 'hair') {
    if (!second) return ['cat:wigs'];
    if (second === 'wigs' && third) return [`cat:wigs`, `hair:${third}`];
    return ['cat:wigs'];
  }

  if (head === 'accessories') {
    const ACCESSORY_MAP = {
      heels: 'cat:heels',
      handbags: 'cat:handbags',
      clutch: 'cat:clutch',
      shoulder: 'cat:shoulder',
      mini: 'cat:mini-bags',
      earrings: 'cat:earrings',
      necklaces: 'cat:necklaces',
      bracelets: 'cat:bracelets',
      rings: 'cat:rings',
    };
    if (ACCESSORY_MAP[third]) return [ACCESSORY_MAP[third]];
    return Object.values(ACCESSORY_MAP);
  }

  return [];
}

export function getBySlug(products, slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function matchByTokens(products, tokens = []) {
  if (!tokens.length) return products;
  return products.filter((p) => p.tags.some((t) => tokens.includes(t)));
}

export function filterProducts(products, filters = {}) {
  const { colors = [], sizes = [], fabrics = [], occasions = [], styles = [], hairTypes = [], price } = filters;
  return products.filter((p) => {
    if (price && (p.price < price[0] || p.price > price[1])) return false;
    if (colors.length && !p.colors.some((c) => colors.includes(c))) return false;
    if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
    const has = (prefix, list) => list.length && !list.every((v) => p.tags.includes(`${prefix}:${v}`)) && !list.some((v) => p.tags.includes(`${prefix}:${v}`));
    if (has('fabric', fabrics)) return false;
    if (has('occ', occasions)) return false;
    if (has('style', styles)) return false;
    if (has('hair', hairTypes)) return false;
    return true;
  });
}

export function sortProducts(products, sortKey = 'featured') {
  const list = [...products];
  switch (sortKey) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    default:
      return list.sort(
        (a, b) =>
          Number(b.tags.includes('tag:featured')) - Number(a.tags.includes('tag:featured')) ||
          new Date(b.createdAt) - new Date(a.createdAt),
      );
  }
}

export function searchProducts(products, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.slug.includes(q) || p.tags.some((t) => t.replace(/^[a-z]+:/, '').includes(q)),
  );
}

export function priceBounds(products) {
  const prices = products.map((p) => p.price);
  return prices.length ? [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))] : [0, 500];
}
