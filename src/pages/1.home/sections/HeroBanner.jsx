import { Link } from 'react-router-dom';
import clsx from 'clsx';

export default function HeroBanner() {
  return (
    <section
      className={clsx('relative', 'overflow-hidden', '-mt-[84px]', 'md:-mt-[96px]', 'lg:-mt-[calc(88px+36px)]')}
      style={{ height: '100svh' }}
    >
      {/* Full-bleed editorial photo */}
      <img
        src="https://ik.imagekit.io/sbgenu6wj/Belioras/Home/heroImageBelioras.png"
        alt="Belioras – New Season Editorial"
        className={clsx('absolute', 'inset-0', 'h-full', 'w-full', 'object-cover', 'object-top')}
        fetchpriority="high"
      />

      {/* Very subtle bottom vignette */}
      <div className={clsx('absolute', 'inset-0', 'bg-gradient-to-t', 'from-black/35', 'via-transparent', 'to-transparent')} />

      {/* Bottom-left CTA — sits above Navbar height so it's always visible */}
      <div className={clsx('absolute', 'bottom-10', 'left-8', 'md:left-12')}>
        <Link
          to="/whats-new"
          className={clsx('group', 'inline-flex', 'flex-col', 'gap-1')}
          aria-label="Shop all new arrivals"
        >
          <span
            className={clsx('text-[11px]', 'uppercase', 'tracking-[0.28em]', 'text-white', 'font-sans', 'font-medium', 'transition-opacity', 'duration-200', 'group-hover:opacity-70')}
          >
            Shop All New Arrivals
          </span>
          <span className={clsx('block', 'h-px', 'bg-white/70', 'w-full', 'origin-left', 'scale-x-100', 'transition-transform', 'duration-300', 'group-hover:scale-x-75')} />
        </Link>
      </div>
    </section>
  );
}
