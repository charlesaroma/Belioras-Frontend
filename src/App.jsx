import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation, Link } from 'react-router-dom';

import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminProvider } from './context/AdminContext';
import { DynamicNavProvider } from './context/DynamicNavContext';
import { FilterProvider } from './context/FilterContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';

import TopBar from './components/layout/TopBar';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';

import Home from './pages/1.home/Home';
import WhatsNew from './pages/2.whatsNew/WhatsNew';
import Shop from './pages/3.shop/Shop';
import CategoryPage from './pages/3.shop/CategoryPage';
import BestSellers from './pages/3.shop/BestSellers';
import ProductDetail from './pages/4.productDetail/ProductDetail';
import Wishlist from './pages/5.wishlist/Wishlist';
import CartPage from './pages/6.cart/CartPage';
import Checkout from './pages/7.checkout/Checkout';
import OrderHistory from './pages/8.orders/OrderHistory';
import Login from './pages/0.auth/Login';
import Signup from './pages/0.auth/Signup';
import ForgotPassword from './pages/0.auth/ForgotPassword';

import DashboardLayout from './dashboard/components/DashboardLayout';
import DashboardHome from './dashboard/0.overview/DashboardHome';
import ProductList from './dashboard/1.products/ProductList';
import CreateProduct from './dashboard/1.products/CreateProduct';
import EditProduct from './dashboard/1.products/EditProduct';
import MegaMenuEditor from './dashboard/2.taxonomies/MegaMenuEditor';
import CategoryManager from './dashboard/2.taxonomies/CategoryManager';
import AttributeManager from './dashboard/2.taxonomies/AttributeManager';
import OrderList from './dashboard/3.orders/OrderList';
import OrderDetail from './dashboard/3.orders/OrderDetail';
import CustomerList from './dashboard/4.customers/CustomerList';
import StoreSettings from './dashboard/5.settings/StoreSettings';

import { getSession } from './services/authService';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  if (!getSession()) return <Navigate to="/login" replace />;
  return children;
}

function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-50">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

/* /dashboard/taxonomies — tabbed managers */
function TaxonomiesHome() {
  return (
    <div className="grid gap-10 xl:grid-cols-2">
      <CategoryManager />
      <AttributeManager />
    </div>
  );
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <p className="font-display text-7xl text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl text-espresso-700">This page has left the runway.</h1>
      <Link to="/" className="mt-8 border border-espresso-700 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-espresso-700 transition-colors hover:bg-espresso-700 hover:text-ivory-50">
        Back to the boutique
      </Link>
    </div>
  );
}

function Shell() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Storefront */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/new-arrivals" element={<WhatsNew />} />
          <Route path="/new-arrivals/catalog" element={<WhatsNew />} />
          <Route path="/new-arrivals/collections" element={<BestSellers />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/*" element={<CategoryPage />} />
          <Route path="/dresses" element={<CategoryPage />} />
          <Route path="/dresses/*" element={<CategoryPage />} />
          <Route path="/hair" element={<CategoryPage />} />
          <Route path="/hair/*" element={<CategoryPage />} />
          <Route path="/accessories" element={<CategoryPage />} />
          <Route path="/accessories/*" element={<CategoryPage />} />
          <Route path="/best-sellers" element={<BestSellers />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Auth — full screen, no navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={<CreateProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="taxonomies" element={<TaxonomiesHome />} />
          <Route path="taxonomies/menu" element={<MegaMenuEditor />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="settings" element={<StoreSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CurrencyProvider>
        <LanguageProvider>
          <AdminProvider>
            <DynamicNavProvider>
              <FilterProvider>
                <WishlistProvider>
                  <CartProvider>
                    <Shell />
                  </CartProvider>
                </WishlistProvider>
              </FilterProvider>
            </DynamicNavProvider>
          </AdminProvider>
        </LanguageProvider>
      </CurrencyProvider>
    </BrowserRouter>
  );
}
