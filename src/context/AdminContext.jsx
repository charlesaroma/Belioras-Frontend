/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { DATA, STORAGE_KEYS, loadJSON, saveJSON } from '../services/jsonDataLoader';

const AdminContext = createContext(null);

const SEED = {
  products: DATA.products,
  attributes: DATA.attributes,
  navigation: DATA.navigation,
  categories: DATA.categories,
  orders: DATA.orders,
};

/*
  Navigation is structural: when the JSON gains new items or new item
  fields (nav position, tiles, children shape), a stale localStorage
  copy would hide or resurrect old structures forever. The JSON carries
  a top-level `rev` marker — bump it on every hand-edit of navigation.json.
  Rev mismatch → stored navigation is discarded wholesale; matching rev →
  per-item admin edits (label/url/children) are preserved.
*/
function hydrateNavigation(freshNav, storedNav) {
  if (!storedNav || storedNav.rev !== freshNav.rev) {
    return { rev: freshNav.rev, items: freshNav.items };
  }
  const storedById = new Map((storedNav.items || []).map((i) => [i.id, i]));
  return {
    rev: freshNav.rev,
    items: freshNav.items.map((fresh) => {
      const saved = storedById.get(fresh.id);
      return saved ? { ...fresh, ...saved, tiles: saved.tiles ?? fresh.tiles } : fresh;
    }),
  };
}

export function AdminProvider({ children }) {
  const [state, setState] = useState(() => {
    const stored = loadJSON(STORAGE_KEYS.admin, null);
    if (!stored) return { ...SEED, activity: [] };
    return { ...stored, navigation: hydrateNavigation(DATA.navigation, stored.navigation) };
  });

  useEffect(() => {
    saveJSON(STORAGE_KEYS.admin, state);
  }, [state]);

  const logActivity = useCallback((message) => {
    setState((s) => ({
      ...s,
      activity: [{ id: `act-${Date.now()}`, message, at: new Date().toISOString() }, ...(s.activity || [])].slice(0, 30),
    }));
  }, []);

  /* ---------- Products CRUD ---------- */
  const addProduct = useCallback(
    (product) => {
      const id = product.id || `prd-${Date.now()}`;
      const next = { ...product, id };
      setState((s) => ({ ...s, products: [next, ...s.products] }));
      logActivity(`Product created — “${next.name}”`);
      return next;
    },
    [logActivity],
  );

  const updateProduct = useCallback(
    (id, patch) => {
      setState((s) => ({
        ...s,
        products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      }));
      logActivity(`Product updated — ${patch.name || id}`);
    },
    [logActivity],
  );

  const deleteProduct = useCallback(
    (id) => {
      setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
      logActivity(`Product deleted — ${id}`);
    },
    [logActivity],
  );

  /* ---------- Attributes CRUD ---------- */
  const addAttributeValue = useCallback(
    (type, value) => {
      setState((s) => {
        const values = s.attributes[type]?.values || [];
        if (values.some((v) => v.id === value.id)) return s;
        return {
          ...s,
          attributes: { ...s.attributes, [type]: { ...s.attributes[type], values: [...values, value] } },
        };
      });
      logActivity(`Attribute added to “${type}” — ${value.name || value.id}`);
    },
    [logActivity],
  );

  const removeAttributeValue = useCallback(
    (type, id) => {
      setState((s) => ({
        ...s,
        attributes: {
          ...s.attributes,
          [type]: { ...s.attributes[type], values: (s.attributes[type]?.values || []).filter((v) => v.id !== id) },
        },
      }));
      logActivity(`Attribute removed from “${type}” — ${id}`);
    },
    [logActivity],
  );

  /* ---------- Categories CRUD ---------- */
  const addCategory = useCallback(
    (category) => {
      setState((s) => {
        if (s.categories.some((c) => c.slug === category.slug)) return s;
        return { ...s, categories: [...s.categories, category] };
      });
      logActivity(`Category created — ${category.slug}`);
    },
    [logActivity],
  );

  const removeCategory = useCallback(
    (slug) => {
      setState((s) => ({ ...s, categories: s.categories.filter((c) => c.slug !== slug) }));
      logActivity(`Category removed — ${slug}`);
    },
    [logActivity],
  );

  /* ---------- Orders ---------- */
  const updateOrderStatus = useCallback(
    (orderId, status) => {
      setState((s) => ({
        ...s,
        orders: (s.orders || []).map((o) => (o.id === orderId ? { ...o, status } : o)),
      }));
      logActivity(`Order ${orderId} marked “${status}”`);
    },
    [logActivity],
  );

  /* ---------- Navigation tree ---------- */
  const updateNavigation = useCallback(
    (items) => {
      // Preserve the rev marker so builder saves don't self-invalidate
      setState((s) => ({ ...s, navigation: { rev: s.navigation?.rev ?? DATA.navigation.rev, items } }));
      logActivity('Mega menu structure saved');
    },
    [logActivity],
  );

  const resetToDefaults = useCallback(() => {
    setState({ ...SEED, activity: [{ id: 'act-reset', message: 'Store data reset to defaults', at: new Date().toISOString() }] });
  }, []);

  const value = useMemo(
    () => ({
      products: state.products,
      attributes: state.attributes,
      navigation: state.navigation,
      categories: state.categories,
      orders: state.orders || [],
      activity: state.activity || [],
      addProduct,
      updateProduct,
      deleteProduct,
      addAttributeValue,
      removeAttributeValue,
      addCategory,
      removeCategory,
      updateNavigation,
      updateOrderStatus,
      resetToDefaults,
    }),
    [
      state,
      addProduct,
      updateProduct,
      deleteProduct,
      addAttributeValue,
      removeAttributeValue,
      addCategory,
      removeCategory,
      updateNavigation,
      updateOrderStatus,
      resetToDefaults,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  return useContext(AdminContext);
}
