/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DATA, STORAGE_KEYS, loadJSON, saveJSON } from '../services/jsonDataLoader';
import { formatCurrency, convertAmount } from '../utils/currencyFormatter';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(() => loadJSON(STORAGE_KEYS.currency, DATA.currencies.baseCurrency));

  useEffect(() => {
    saveJSON(STORAGE_KEYS.currency, code);
  }, [code]);

  const value = useMemo(
    () => ({
      code,
      setCode,
      rates: DATA.currencies.rates,
      currencies: DATA.currencies.currencies,
      baseCurrency: DATA.currencies.baseCurrency,
      convert: (amountInBase) => convertAmount(amountInBase, code, DATA.currencies.rates),
      format: (amountInBase) => formatCurrency(amountInBase, code, DATA.currencies.rates),
    }),
    [code],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
