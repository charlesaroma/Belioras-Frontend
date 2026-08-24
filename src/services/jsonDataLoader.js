import currencies from '../data/currencies.json';
import languages from '../data/languages.json';
import attributes from '../data/attributes.json';
import categoriesData from '../data/categories.json';
import navigation from '../data/navigation.json';
import productsData from '../data/products.json';
import ordersData from '../data/orders.json';
import customersData from '../data/customers.json';
import instagramData from '../data/instagram.json';

export const DATA = {
  currencies,
  languages,
  attributes,
  categories: categoriesData.categories,
  categoryLabels: categoriesData.labels,
  navigation,
  products: productsData.products,
  orders: ordersData.orders,
  customers: customersData.customers,
  instagram: instagramData.posts,
};

export const STORAGE_KEYS = {
  admin: 'belioras_admin_v1',
  cart: 'belioras_cart_v1',
  wishlist: 'belioras_wishlist_v1',
  currency: 'belioras_currency_v1',
  language: 'belioras_language_v1',
  session: 'belioras_session_v1',
  users: 'belioras_users_v1',
};

export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — run in-memory */
  }
}
