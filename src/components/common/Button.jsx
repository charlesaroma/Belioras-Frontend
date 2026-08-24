const VARIANTS = {
  primary: 'bg-espresso-700 text-ivory-50 hover:bg-espresso-500 border border-espresso-700',
  gold: 'bg-gold-500 text-espresso-800 hover:bg-gold-400 border border-gold-600',
  outline: 'bg-transparent text-espresso-700 border border-espresso-700 hover:bg-espresso-700 hover:text-ivory-50',
  ghost: 'bg-transparent text-espresso-500 hover:text-espresso-700 border border-transparent',
};

const SIZES = {
  sm: 'px-4 py-2 text-[11px]',
  md: 'px-6 py-3 text-xs',
  lg: 'px-10 py-4 text-sm',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 uppercase tracking-[0.18em] font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
