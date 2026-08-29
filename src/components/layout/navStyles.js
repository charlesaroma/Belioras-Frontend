/* Shared hover/interaction conventions for the storefront nav (Navbar,
   DynamicMegaMenu, MobileNav, RegionSelector) — one place so every
   interactive element hovers the same way, at the same speed. */

export const NAV_LINK =
  'relative pb-0.5 transition-colors duration-200 hover:text-gold-600 ' +
  'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform after:duration-200 hover:after:scale-x-100';

export const ICON_BUTTON = 'transition-colors duration-200 hover:text-gold-600';

export const PILL = 'rounded-full border px-3 py-1 text-[11px] uppercase tracking-widest transition-colors duration-200';
export const PILL_ACTIVE = 'border-espresso-700 bg-espresso-700 text-ivory-50';
export const PILL_INACTIVE = 'border-ivory-600 text-espresso-500 hover:border-espresso-300';
