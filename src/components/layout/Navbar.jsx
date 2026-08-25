import { useState, useCallback, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { IconButton, useMediaQuery } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';
import { useCart } from '../../context/CartContext';
import SearchBar from './SearchBar';
import MobileNav from './MobileNav';

const NAV_LINKS = [
  { label: "What's New", path: '/whats-new' },
  { label: 'Shop', path: '/shop' },
  { label: "Best Seller's", path: '/shop?sort=best-seller' },
];

const NAV_LINKS_RIGHT = [
  { label: 'Occasion', path: '/occasion' },
  { label: 'Dresses', path: '/dresses' },
  { label: 'Login', path: '/login' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count: cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Reset scrolled when navigating to home
  useEffect(() => {
    if (isHome) setScrolled(window.scrollY > 80);
    else setScrolled(true);
  }, [location.pathname, isHome]);

  const linkClass = ({ isActive }) =>
    clsx(
      'relative text-[12px] uppercase tracking-[0.1em] font-sans font-medium transition-colors duration-200 pb-0.5',
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

  // Logo: white version when transparent, gold when solid
  const logoSrc = transparent
    ? '/belioras-boutique-primary-logo-rgb-white 1.svg'
    : '/belioras-boutique-primary-logo-rgb-belioras-gold 1.svg';

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full transition-all duration-300',
        transparent
          ? 'bg-transparent border-b border-white/10'
          : 'bg-ivory-50/97 backdrop-blur-sm border-b border-ivory-200/60 shadow-sm',
      )}
    >
      <nav className="relative mx-auto flex h-16 md:h-[68px] max-w-[1400px] items-center justify-between px-6 md:px-10">

        {/* Left nav links */}
        <div className="hidden md:flex items-center gap-7 flex-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Centre logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          aria-label="Belioras Home"
        >
          <img
            src={logoSrc}
            alt="Belioras"
            className="h-10 md:h-12 w-auto transition-opacity duration-300"
          />
        </Link>

        {/* Right nav links + icons */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-end">
          {NAV_LINKS_RIGHT.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Search */}
          <IconButton
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            size="small"
            className={clsx('transition-colors duration-200', iconColor)}
            sx={{ color: 'inherit', padding: '6px' }}
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
            <ShoppingBagOutlinedIcon fontSize="small" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-semibold text-white leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile: search + cart + hamburger */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
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
            <ShoppingBagOutlinedIcon fontSize="small" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gold-500 text-[8px] font-semibold text-white leading-none">
                {cartCount}
              </span>
            )}
          </button>

          <IconButton
            onClick={toggleMobile}
            aria-label="Menu"
            size="small"
            sx={{ color: transparent ? '#fff' : 'inherit' }}
          >
            {mobileOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
        </div>
      </nav>

      {/* Mobile drawer */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Search overlay */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
