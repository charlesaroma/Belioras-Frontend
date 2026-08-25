import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ height: '100svh', marginTop: 'calc(-68px - 36px)' }}
    >
      {/* Full-bleed editorial photo */}
      <img
        src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=90&w=2400&auto=format&fit=crop&crop=top"
        alt="Belioras – New Season Editorial"
        className="absolute inset-0 h-full w-full object-cover object-top"
        fetchpriority="high"
      />

      {/* Very subtle bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      {/* Bottom-left CTA — sits above Navbar height so it's always visible */}
      <div className="absolute bottom-10 left-8 md:left-12">
        <Link
          to="/whats-new"
          className="group inline-flex flex-col gap-1"
          aria-label="Shop all new arrivals"
        >
          <span
            className="text-[11px] uppercase tracking-[0.28em] text-white font-sans font-medium
              transition-opacity duration-200 group-hover:opacity-70"
          >
            Shop All New Arrivals
          </span>
          <span className="block h-px bg-white/70 w-full origin-left scale-x-100 transition-transform duration-300 group-hover:scale-x-75" />
        </Link>
      </div>
    </section>
  );
}
