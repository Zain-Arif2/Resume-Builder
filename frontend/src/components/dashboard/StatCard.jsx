export default function StatCard({ label, value, sublabel }) {
  return (
    <div className="bg-paper border border-slate/10 rounded-2xl p-5">
      <p className="text-slate text-xs font-medium uppercase tracking-wide mb-2">{label}</p>
      <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      {sublabel && <p className="text-slate/60 text-xs mt-1">{sublabel}</p>}
    </div>
  );
}
