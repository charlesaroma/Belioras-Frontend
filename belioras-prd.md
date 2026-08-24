Product Requirements Document (PRD)
Project Name: Belioras E-Commerce Platform & Admin Dashboard
Author: Software Engineering Team
Version: 1.0.0
Date: August 25, 2026
1. Project Overview & Vision
Belioras is a high-fashion luxury e-commerce platform designed with an editorial, wide visual layout, dynamic taxonomy filtering (color, size, fabric, occasion, style, hair), multi-currency switching, and full internationalization (i18n).
The application consists of two primary modules:
1. Storefront (/pages): A luxury fashion shopping experience featuring dynamic mega menus, quick cart editing drawers, wishlist management, dynamic catalog layouts, and localized pricing.
2. Admin Dashboard (/dashboard): A management portal providing full CRUD capabilities over products, real-time inventory management, order processing, and dynamic taxonomy editing (navigation.json and attributes.json).
2. Tech Stack & Target Architecture
⚬ Frontend Framework: React.js (Vite) / React Router v6
⚬ Styling & Motion: Tailwind CSS, Framer Motion
⚬ State Management: React Context API (CartContext, WishlistContext, FilterContext, CurrencyContext, LanguageContext, DynamicNavContext, AdminContext)
⚬ Local Storage & Mock Persistence: src/data/*.json loaded via asynchronous service modules (jsonDataLoader.js, productService.js, taxonomyService.js)
3. Core Functional Requirements
3.1 Storefront & Catalog Management
⚬ Dynamic Mega Menu: Renders navigation hierarchies automatically based on dynamic taxonomies (categories.json and navigation.json). Hover actions update DynamicNavContext.
⚬ Multi-Attribute Product Filtering: Filters product grids by custom attributes (Color swatches, XS–XL sizes, Fabrics, Occasion, Hair types) via the slide-over FilterDrawer.jsx.
⚬ Dynamic Grid View Switcher: Allows switching product catalog layouts across column densities (2, 3, 4, or 6 columns).
⚬ Localized Shopping Experience: ⚬ Currency Switcher: Converts catalog base prices dynamically using active exchange rates from CurrencyContext.jsx via currencyFormatter.js. ⚬ Language Switcher: Loads translation keys from languages.json using i18n.js.
3.2 Product Detail Page (PDP) & Cart Experience
⚬ PDP Variant Selection: Interactive color swatches (ColorSelector.jsx), size selection (SizeSelector.jsx), quantity toggles (QuantitySelector.jsx), and Size Guide modal popups.
⚬ Slide-over Cart Drawer: Displays subtotal calculation, free shipping thresholds, and empty cart states.
⚬ Inline Cart Editing: Allows changing color and size directly inside CartItem.jsx without navigating away from the current view.
⚬ Full Cart Page (/cart): A dedicated full-page shopping cart view (CartPageView.jsx).
3.3 Admin Dashboard Module
⚬ Analytics Overview (0.overview): Stat widgets displaying revenue, order volume, low stock alerts, and recent transactions.
⚬ Product CRUD (1.products): ⚬ Create/Update: Add products with rich attribute tagging (Color, Size, Fabric, Occasion, Style, Hair), manage multi-image uploads (MediaUploader.jsx), and edit variant stock levels. ⚬ Delete/Search: Filterable data table (DataTable.jsx) with batch actions and search.
⚬ Taxonomy & Dynamic Menu Manager (2.taxonomies): ⚬ Create, edit, or delete dynamic tags in attributes.json. ⚬ Visual drag-and-drop tree builder (MegaMenuBuilder.jsx) to update navigation.json structure live across the user storefront.
⚬ Order & Customer Management (3.orders, 4.customers): View customer purchasing history, update shipping/fulfillment statuses, and inspect line-item details.
4. System Architecture & File Directory Mapping
The project enforces a strict, numbered feature-folder architecture to isolate customer-facing routes and administrative management tools:
src/
├── assets/                                    # Logos and icon SVGs
├── data/                                      # Mock JSON data stores (products, attributes, navigation, etc.)
├── components/                                # Reusable UI components
│   ├── layout/                                # Navbar, TopBar, MegaMenu, Footer
│   ├── cart/                                  # CartDrawer, CartItem, CartSummary
│   ├── product/                               # ProductCard, Gallery, Color/Size selectors
│   ├── filters/                               # FilterDrawer, FilterAccordion, GridViewSwitcher
│   ├── home/                                  # HeroBanner, CategoryGrid, InstagramFeed
│   ├── wishlist/                              # WishlistGrid, WishlistItem
│   └── common/                                # CurrencySelector, LanguageSelector, Modals, Drawers
│
├── dashboard/                                 # Admin Dashboard Module (Root Level)
│   ├── 0.overview/                            # DashboardHome.jsx
│   ├── 1.products/                            # ProductList.jsx, CreateProduct.jsx, EditProduct.jsx
│   ├── 2.taxonomies/                          # CategoryManager.jsx, AttributeManager.jsx, MegaMenuEditor.jsx
│   ├── 3.orders/                              # OrderList.jsx, OrderDetail.jsx
│   ├── 4.customers/                           # CustomerList.jsx
│   ├── 5.settings/                            # StoreSettings.jsx
│   └── components/                            # DashboardLayout, DashboardSidebar, StatCard, DataTable
│
├── context/                                   # Shared Context Providers (Currency, Language, Cart, Filter, Admin)
├── pages/                                     # Top-Level Storefront Page Views
│   ├── 0.auth/                                # Login.jsx, Signup.jsx, ForgotPassword.jsx
│   ├── 1.home/                                # Home.jsx
│   ├── 2.whatsNew/                            # WhatsNew.jsx
│   ├── 3.shop/                                # Shop.jsx, CategoryPage.jsx, BestSellers.jsx
│   ├── 4.productDetail/                       # ProductDetail.jsx
│   ├── 5.wishlist/                            # Wishlist.jsx
│   ├── 6.cart/                                # CartPage.jsx
│   └── 7.checkout/                            # Checkout.jsx
│
├── services/                                  # Data service layers (jsonDataLoader.js, productService.js)
├── utils/                                     # Helpers (currencyFormatter.js, i18n.js, formatters.js)
├── App.jsx                                    # Router setup & layout providers
├── main.jsx                                   # Application entry point
└── index.css                                  # Global Tailwind styles

5. Key Non-Functional Requirements & UX Rules
⚬ Performance & Local Execution: Optimized for local client-side state transitions with fast state hydration from local JSON stores.
⚬ Responsive Layout Design: Desktop views maintain horizontal spacing and balance, scaling cleanly down to mobile drawer-based navigation (MobileNav.jsx).
⚬ Dry Component Architecture: Core variant selectors (ColorSelector.jsx, SizeSelector.jsx) are shared across PDP views and inline Cart Drawer editing to prevent logic duplication.