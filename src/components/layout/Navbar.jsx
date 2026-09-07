import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';
import { useCart } from '../../context/CartContext';
import { useDynamicNav } from '../../context/DynamicNavContext';
import { useLanguage } from '../../context/LanguageContext';
import { getSession } from '../../services/authService';
import SearchBar from './SearchBar';
import MobileNav from './MobileNav';
import DynamicMegaMenu from './DynamicMegaMenu';
import CurrencySelector from '../common/CurrencySelector';
import LanguageSelector from '../common/LanguageSelector';
import { NAV_LINK, ICON_BUTTON } from './navStyles';

const HOVER_CLOSE_DELAY = 150;

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuTop, setMenuTop] = useState(0);
  const closeTimer = useRef(null);
  const headerRef = useRef(null);

  const { count: cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, hoveredId, setHoveredId, hasFlyout } = useDynamicNav();
  const { lang } = useLanguage();

  // Only go transparent on the home page
  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Reset scrolled + close mega menu when navigating
  useEffect(() => {
    setScrolled(isHome ? window.scrollY > 80 : true);
    setHoveredId(null);
  }, [location.pathname, isHome, setHoveredId]);

  // Close mega menu on Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setHoveredId(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setHoveredId]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* Portal positioning: keep the flyout flush under the header,
     wherever the header currently sits (TopBar offset, scroll). */
  const syncMenuPosition = useCallback(() => {
    const header = headerRef.current;
    if (header) setMenuTop(header.getBoundingClientRect().bottom);
  }, []);

  useEffect(() => {
    if (!hasFlyout) return undefined;
    syncMenuPosition();
    window.addEventListener('scroll', syncMenuPosition, { passive: true });
    window.addEventListener('resize', syncMenuPosition);
    return () => {
      window.removeEventListener('scroll', syncMenuPosition);
      window.removeEventListener('resize', syncMenuPosition);
    };
  }, [hasFlyout, syncMenuPosition]);

  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setHoveredId(null), HOVER_CLOSE_DELAY);
  }, [setHoveredId]);

  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);

  const linkClass = ({ isActive }) =>
    clsx(
      'text-[13px] lg:text-[16px] uppercase tracking-[0.1em] font-sans font-medium',
      NAV_LINK,
      transparent
        ? (isActive ? 'text-white after:scale-x-100' : 'text-white/90')
        : (isActive ? 'text-espresso-700 after:scale-x-100' : 'text-espresso-500'),
    );

  const handleCartClick = useCallback(() => navigate('/cart'), [navigate]);
  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);

  const iconColor = transparent ? 'text-white' : 'text-espresso-500';

  // Logo variants: white while the header is transparent (hero behind),
  // original everywhere else (inline solid + inside the ivory dome).
  const logoInlineSrc = transparent
    ? '/belioras-boutique-primary-logo-rgb-white 1.svg'
    : '/belioras-boutique-primary-logo-rgb-belioras-original.svg';
  const logoDomeSrc = '/belioras-boutique-primary-logo-rgb-belioras-original.svg';

  const navLeft = (items || []).filter((i) => i.nav === 'left');
  const navRight = (items || []).filter((i) => i.nav === 'right');

  const renderNavItem = (item) => {
    const label =
      typeof item.label === 'string' ? item.label : item.label?.[lang] || item.label?.en;
    const hasMenu = Boolean(item.children?.length || item.tiles?.length);
    const isOpen = hoveredId === item.id;

    if (!hasMenu) {
      return (
        <NavLink key={item.id} to={item.url} className={linkClass}>
          {label}
        </NavLink>
      );
    }

    return (
      <div
        key={item.id}
        className="relative"
        onMouseEnter={() => { cancelClose(); setHoveredId(item.id); }}
        onMouseLeave={scheduleClose}
      >
        <NavLink
          to={item.url}
          onClick={() => setHoveredId(null)}
          className={({ isActive }) =>
            clsx(
              'text-[13px] lg:text-[16px] uppercase tracking-[0.1em] font-sans font-medium',
              NAV_LINK,
              isOpen || isActive
                ? 'text-gold-600 after:scale-x-100'
                : transparent ? 'text-white/90' : 'text-espresso-500',
            )
          }
          aria-expanded={isOpen}
        >
          {label}
        </NavLink>
      </div>
    );
  };

  return (
    <header
      ref={headerRef}
      className={clsx(
        'sticky top-0 z-50 w-full transition-all duration-300',
        transparent
          ? 'bg-transparent'
          : 'bg-ivory-50/97 backdrop-blur-sm shadow-sm',
      )}
      onMouseLeave={scheduleClose}
    >
      <nav className="relative mx-auto flex h-[84px] max-w-[1400px] items-center justify-between px-6 md:px-10">

        {/* Left nav links — WHAT'S NEW · SHOP · BEST SELLERS */}
        <div className="hidden lg:flex items-center gap-7 flex-1">
          {navLeft.map(renderNavItem)}
        </div>

        {/* Centre logo — inline while transparent, dome tab once solid */}
        {transparent ? (
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 h-full flex items-center justify-center"
            aria-label="Belioras Home"
          >
            <img
              src={logoInlineSrc}
              alt="Belioras"
              className="w-[114px] h-[84px] transition-opacity duration-300"
            />
          </Link>
        ) : (
          <div
            className={clsx(
              'absolute left-1/2 -translate-x-1/2 top-0 z-10',
              'flex flex-col items-center rounded-b-full',
              'w-[194px] h-[128px]',
              'bg-ivory-50/97 backdrop-blur-sm',
            )}
          >
            <div className="flex items-center justify-center w-full h-[84px]">
              <Link to="/" aria-label="Belioras Home" className="flex items-center justify-center">
                <img
                  src={logoDomeSrc}
                  alt="Belioras"
                  className="w-[114px] h-[84px]"
                />
              </Link>
            </div>
          </div>
        )}

        {/* Right side — OCCASION · DRESSES · LOGIN + icons */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-end">
          {navRight.map(renderNavItem)}

          {/* Search */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className={clsx('flex items-center justify-center', ICON_BUTTON, iconColor)}
          >
            <SearchOutlinedIcon fontSize="small" />
          </button>

          {/* Account */}
          <Link
            to={getSession() ? '/orders' : '/login'}
            aria-label="Account"
            className={clsx('flex items-center justify-center', ICON_BUTTON, iconColor)}
          >
            <PersonOutlineOutlinedIcon fontSize="small" />
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={handleCartClick}
            aria-label={`Cart, ${cartCount} items`}
            className={clsx('relative flex items-center justify-center', ICON_BUTTON, iconColor)}
          >
            <ShoppingCartOutlinedIcon fontSize="small" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-semibold text-white leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Currency and language — separate icon triggers */}
          <CurrencySelector className={iconColor} iconOnly />
          <LanguageSelector className={iconColor} iconOnly />
        </div>

        {/* Below lg: burger left, logo centre, search + cart right */}
        <div className="lg:hidden flex w-full items-center">
          <button
            type="button"
            onClick={toggleMobile}
            aria-label="Menu"
            className={clsx('flex items-center justify-center p-1.5', ICON_BUTTON, iconColor)}
          >
            {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={clsx('flex items-center justify-center p-1.5', ICON_BUTTON, iconColor)}
            >
              <SearchOutlinedIcon fontSize="small" />
            </button>

            <button
              type="button"
              onClick={handleCartClick}
              aria-label="Cart"
              className={clsx('relative flex items-center justify-center p-1.5', ICON_BUTTON, iconColor)}
            >
              <ShoppingCartOutlinedIcon fontSize="small" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-500 text-[8px] font-semibold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mega menu flyout — portaled to body with fixed positioning so
          page-level stacking/overflow can never interfere (works on all pages) */}
      {hasFlyout &&
        createPortal(
          <div
            className="fixed inset-x-0 z-40 max-h-[calc(100vh-80px)] overflow-y-auto"
            style={{ top: menuTop }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <DynamicMegaMenu />
          </div>,
          document.body,
        )}

      {/* Mobile drawer */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Search overlay */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
