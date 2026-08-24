export default function StatCard({ title, value, delta, accent = false }) {
  return (
    <div className={`border p-5 ${accent ? 'border-gold-500 bg-champagne-50' : 'border-ivory-600 bg-ivory-50'}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-espresso-400">{title}</p>
      <p className="mt-2 font-display text-3xl text-espresso-700">{value}</p>
      {delta && (
        <p className={`mt-1 text-xs ${delta.startsWith('-') ? 'text-error' : 'text-success'}`}>
          {delta} vs last month
        </p>
      )}
    </div>
  );
}
