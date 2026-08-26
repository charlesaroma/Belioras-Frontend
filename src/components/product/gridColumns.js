/*
  Each selection must render EXACTLY its column count from sm up —
  the switcher is visible from md, so a "4" click must show 4 columns
  immediately (the old xl:-prefixed classes made 4/6 lie on laptops,
  and lg:-prefixed 3 lied on tablets). Phones keep a 2-column floor
  since the switcher is hidden below md.
*/
export const COLUMN_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  6: 'grid-cols-2 sm:grid-cols-6',
  // Row layout — one product per row, card held to a readable width
  row: 'grid-cols-1 mx-auto w-full max-w-sm',
};
