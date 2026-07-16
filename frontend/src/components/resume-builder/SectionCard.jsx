export default function SectionCard({ title, subtitle, action, children }) {
  return (
<div className="w-full max-w-full overflow-hidden bg-paper border border-slate/10 rounded-2xl p-4 sm:p-6 mb-6">      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="font-display font-semibold text-ink text-lg">{title}</h2>
          {subtitle && <p className="text-slate text-sm mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
