import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { IconButton } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';
import { useCart } from '../../context/CartContext';
import { useDynamicNav } from '../../context/DynamicNavContext';
import { useLanguage } from '../../context/LanguageContext';
import SearchBar from './SearchBar';
import MobileNav from './MobileNav';
import DynamicMegaMenu from './DynamicMegaMenu';

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
      'relative text-[13px] lg:text-[16px] uppercase tracking-[0.1em] font-sans font-medium transition-colors duration-200 pb-0.5',
      'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100',
      transparent
        ? [
            'text-white/90 hover:text-white',
            isActive
              ? 'text-white after:scale-x-100 after:bg-white'
              : 'after:bg-white',
          ]
        : [
            isActive
              ? 'text-espresso-700 after:scale-x-100 after:bg-gold-500'
              : 'text-espresso-500 hover:text-espresso-700 after:bg-gold-500',
          ],
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
        <button
          type="button"
          onClick={() => setHoveredId(isOpen ? null : item.id)}
          className={clsx(
            'flex items-center gap-1.5 text-[13px] lg:text-[16px] uppercase tracking-[0.1em] font-sans font-medium transition-colors duration-200 pb-0.5',
            isOpen
              ? 'text-gold-600'
              : transparent
                ? 'text-white/90 hover:text-white'
                : 'text-espresso-500 hover:text-espresso-700',
          )}
          aria-expanded={isOpen}
        >
          {label}
          {isOpen && <CloseIcon sx={{ fontSize: 14 }} />}
        </button>
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
      <nav className="relative mx-auto flex h-[84px] md:h-[96px] lg:h-[88px] max-w-[1400px] items-center justify-between px-6 md:px-10">

        {/* Left nav links — WHAT'S NEW · SHOP · BEST SELLERS */}
        <div className="hidden lg:flex items-center gap-7 flex-1">
          {navLeft.map(renderNavItem)}
        </div>

        {/* Centre logo — inline while transparent, dome tab once solid */}
        {transparent ? (
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
            aria-label="Belioras Home"
          >
            <img
              src={logoInlineSrc}
              alt="Belioras"
              className="h-[58px] sm:h-[68px] md:h-[76px] w-auto transition-opacity duration-300"
            />
          </Link>
        ) : (
          <div
            className={clsx(
              'absolute left-1/2 -translate-x-1/2 bottom-0 z-10',
              'flex items-start justify-center rounded-b-full',
              'w-48 h-16 sm:w-64 sm:h-24 pt-3 sm:pt-4',
              'bg-ivory-100',
            )}
          >
            <Link to="/" aria-label="Belioras Home" className="flex items-start">
              <img
                src={logoDomeSrc}
                alt="Belioras"
                className="h-[38px] sm:h-[52px] w-auto"
              />
            </Link>
          </div>
        )}

        {/* Right side — OCCASION · DRESSES · LOGIN + icons */}
        <div className="hidden lg:flex items-center gap-7 flex-1 justify-end">
          {navRight.map(renderNavItem)}

          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>

          {/* Search */}
          <IconButton
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            size="small"
            sx={{ color: transparent ? '#fff' : 'inherit', padding: '6px' }}
          >
            <SearchOutlinedIcon fontSize="small" />
          </IconButton>

          {/* Cart */}
          <button
            onClick={handleCartClick}
            aria-label={`Cart, ${cartCount} items`}
            className={clsx(
              'relative flex items-center justify-center transition-colors duration-200',
              iconColor,
            )}
          >
            <ShoppingCartOutlinedIcon fontSize="small" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-semibold text-white leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Below lg: burger left, logo centre, search + cart right */}
        <div className="lg:hidden flex w-full items-center">
          <IconButton
            onClick={toggleMobile}
            aria-label="Menu"
            size="small"
            sx={{ color: transparent ? '#fff' : 'inherit' }}
          >
            {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>

          <div className="ml-auto flex items-center gap-1">
            <IconButton
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              size="small"
              sx={{ color: transparent ? '#fff' : 'inherit' }}
            >
              <SearchOutlinedIcon fontSize="small" />
            </IconButton>

            <button
              onClick={handleCartClick}
              aria-label="Cart"
              className={clsx('relative flex items-center justify-center p-1.5', iconColor)}
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
