/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';
import { useAdmin } from './AdminContext';
import { navItemLabel } from '../services/taxonomyService';

const DynamicNavContext = createContext(null);

export function DynamicNavProvider({ children }) {
  const { navigation } = useAdmin();
  const [hoveredId, setHoveredId] = useState(null);

  const value = useMemo(() => {
    const items = navigation?.items || [];
    const hoveredItem = items.find((i) => i.id === hoveredId) || null;
    return {
      items,
      hoveredId,
      setHoveredId,
      hoveredItem,
      hasFlyout: Boolean(hoveredItem && hoveredItem.children && hoveredItem.children.length),
      labelFor: (item, lang) => navItemLabel(item, lang),
    };
  }, [navigation, hoveredId]);

  return <DynamicNavContext.Provider value={value}>{children}</DynamicNavContext.Provider>;
}

export function useDynamicNav() {
  return useContext(DynamicNavContext);
}
