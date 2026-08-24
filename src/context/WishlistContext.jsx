/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../services/jsonDataLoader';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => loadJSON(STORAGE_KEYS.wishlist, []));

  useEffect(() => {
    saveJSON(STORAGE_KEYS.wishlist, ids);
  }, [ids]);

  const toggle = useCallback((productId) => {
    setIds((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]));
  }, []);

  const has = useCallback((productId) => ids.includes(productId), [ids]);
  const remove = useCallback((productId) => setIds((prev) => prev.filter((id) => id !== productId)), []);
  const clear = useCallback(() => setIds([]), []);

  const value = useMemo(() => ({ ids, toggle, has, remove, clear, count: ids.length }), [ids, toggle, has, remove, clear]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  return useContext(WishlistContext);
}
