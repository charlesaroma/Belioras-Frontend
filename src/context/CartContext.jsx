/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { STORAGE_KEYS, loadJSON, saveJSON } from '../services/jsonDataLoader';
import { useAdmin } from './AdminContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { products } = useAdmin();
  const [items, setItems] = useState(() => loadJSON(STORAGE_KEYS.cart, []));
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.cart, items);
  }, [items]);

  /* Lines whose product was deleted in the dashboard are ignored everywhere */
  const validItems = useMemo(
    () => items.filter((line) => products.some((p) => p.id === line.productId)),
    [items, products],
  );

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);
  const toggleDrawer = useCallback(() => setIsOpen((v) => !v), []);

  const addItem = useCallback((product, { color, size, qty = 1 }) => {
    const lineId = `${product.id}::${color?.id || 'default'}::${size}`;
    setItems((prev) => {
      const existing = prev.find((l) => l.lineId === lineId);
      if (existing) {
        return prev.map((l) => (l.lineId === lineId ? { ...l, qty: Math.min(l.qty + qty, 99) } : l));
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.images[0],
          price: product.price,
          color: { id: color?.id || null, name: color?.name || '', hex: color?.hex || '#CCC' },
          size,
          qty,
        },
      ];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((lineId) => {
    setItems((prev) => prev.filter((l) => l.lineId !== lineId));
  }, []);

  const updateQty = useCallback((lineId, delta) => {
    setItems((prev) =>
      prev
        .map((l) => (l.lineId === lineId ? { ...l, qty: Math.max(0, Math.min(99, l.qty + delta)) } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const updateVariant = useCallback((lineId, patch) => {
    setItems((prev) =>
      prev.map((l) => {
        if (l.lineId !== lineId) return l;
        const next = { ...l };
        if (patch.color) next.color = patch.color;
        if (patch.size !== undefined && patch.size !== null) next.size = patch.size;
        next.lineId = `${next.productId}::${next.color?.id || 'default'}::${next.size}`;
        return next;
      }),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = useMemo(() => validItems.reduce((sum, l) => sum + l.price * l.qty, 0), [validItems]);
  const count = useMemo(() => validItems.reduce((sum, l) => sum + l.qty, 0), [validItems]);

  const value = useMemo(
    () => ({
      items: validItems,
      isOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addItem,
      removeItem,
      updateQty,
      updateVariant,
      clearCart,
      subtotal,
      count,
    }),
    [validItems, isOpen, openDrawer, closeDrawer, toggleDrawer, addItem, removeItem, updateQty, updateVariant, clearCart, subtotal, count],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
