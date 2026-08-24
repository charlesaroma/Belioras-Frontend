/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react';

const FilterContext = createContext(null);

export const SORT_OPTIONS = ['featured', 'price-asc', 'price-desc', 'newest'];
export const COLUMN_OPTIONS = [2, 3, 4, 6];

export function FilterProvider({ children }) {
  const [activeTags, setActiveTags] = useState({
    color: [],
    size: [],
    fabric: [],
    occasion: [],
    style: [],
    hair: [],
  });
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [sortBy, setSortBy] = useState('featured');
  const [columns, setColumns] = useState(3);

  const toggleTag = (dimension, tagId) =>
    setActiveTags((prev) => ({
      ...prev,
      [dimension]: prev[dimension].includes(tagId)
        ? prev[dimension].filter((t) => t !== tagId)
        : [...prev[dimension], tagId],
    }));

  const clearAll = () => {
    setActiveTags({ color: [], size: [], fabric: [], occasion: [], style: [], hair: [] });
    setPriceRange([0, 600]);
  };

  const activeCount = useMemo(
    () => Object.values(activeTags).reduce((sum, list) => sum + list.length, 0) + (priceRange[1] < 600 ? 1 : 0),
    [activeTags, priceRange],
  );

  const asFilters = useMemo(
    () => ({
      colors: activeTags.color,
      sizes: activeTags.size,
      fabrics: activeTags.fabric,
      occasions: activeTags.occasion,
      styles: activeTags.style,
      hairTypes: activeTags.hair,
      price: priceRange,
    }),
    [activeTags, priceRange],
  );

  const value = useMemo(
    () => ({ activeTags, toggleTag, priceRange, setPriceRange, sortBy, setSortBy, columns, setColumns, clearAll, activeCount, asFilters }),
    [activeTags, priceRange, sortBy, columns, activeCount, asFilters],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  return useContext(FilterContext);
}
