import { Link } from 'react-router-dom';

/* Full-screen editorial split panel shared by login / signup / forgot-password.
   Rendered outside StoreLayout (see App.jsx) — no navbar/footer chrome. */
export default function AuthSplitShell({ heroImage, kicker, title, blurb, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={heroImage} alt="Belioras" className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-800/90 via-espresso-800/30 to-espresso-800/10" />
        <div className="absolute bottom-12 left-12 right-12 text-ivory-50">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold-400">{kicker}</p>
          <h2 className="mb-4 font-display text-4xl leading-tight xl:text-5xl">{title}</h2>
          <p className="max-w-sm text-sm leading-relaxed text-ivory-50/70">{blurb}</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-ivory-50 px-6 py-16 sm:px-12 lg:px-16 xl:px-24">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-10 flex justify-center lg:justify-start" aria-label="Belioras Home">
            <img
              src="/belioras-boutique-primary-logo-rgb-belioras-original.svg"
              alt="Belioras"
              className="h-12 w-auto"
            />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
