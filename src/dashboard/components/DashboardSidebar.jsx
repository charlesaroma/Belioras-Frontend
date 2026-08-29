import { NavLink, Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const NAV = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/products', label: 'Products' },
  { to: '/dashboard/taxonomies', label: 'Taxonomies' },
  { to: '/dashboard/taxonomies/menu', label: 'Mega Menu' },
  { to: '/dashboard/orders', label: 'Orders' },
  { to: '/dashboard/customers', label: 'Customers' },
  { to: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b bg-espresso-800 text-ivory-100 md:min-h-screen md:w-60 md:border-b-0 md:border-r md:border-espresso-600">
      <Link to="/" className="flex items-center gap-3 border-b border-espresso-600 px-5 py-4 transition-opacity hover:opacity-90">
        <img src="/belioras-logo.png" alt="Belioras" className="h-14 w-auto rounded-sm" />
        <span className="sr-only">Belioras — back to storefront</span>
      </Link>
      <p className="px-5 pb-1 pt-4 text-[9px] uppercase tracking-[0.3em] text-espresso-300">Admin Console</p>

      <nav className="flex flex-row gap-1 overflow-x-auto px-3 py-3 md:flex-col">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-sm px-3 py-2.5 text-xs uppercase tracking-widest transition-colors ${
                isActive ? 'bg-gold-500 text-espresso-800' : 'text-espresso-100/80 hover:bg-espresso-700 hover:text-ivory-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-espresso-600 p-4">
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full rounded-sm px-3 py-2 text-left text-xs uppercase tracking-widest text-espresso-200 transition-colors hover:bg-error/10 hover:text-error"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
