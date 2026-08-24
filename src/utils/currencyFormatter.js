const SYMBOLS = { EUR: '€', USD: '$', GBP: '£' };

export function convertAmount(amountInBase, currencyCode, exchangeRates) {
  const rate = (exchangeRates && exchangeRates[currencyCode]) || 1;
  return amountInBase * rate;
}

export function formatCurrency(amountInBase, activeCurrencyCode = 'EUR', exchangeRates = { EUR: 1.0, USD: 1.09, GBP: 0.85 }) {
  const converted = convertAmount(Number(amountInBase) || 0, activeCurrencyCode, exchangeRates);
  const symbol = SYMBOLS[activeCurrencyCode] || `${activeCurrencyCode} `;
  return `${symbol} ${converted.toFixed(2)}`;
}
