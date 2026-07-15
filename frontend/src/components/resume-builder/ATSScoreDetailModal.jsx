import { X, CheckCircle2, AlertTriangle, Lightbulb, RefreshCw } from 'lucide-react';

function scoreColor(score) {
  if (score >= 75) return 'text-emerald bg-emerald-dim';
  if (score >= 50) return 'text-amber bg-amber-dim';
  return 'text-danger bg-danger-dim';
}

export default function ATSScoreDetailModal({ result, onClose, onRecheck, isLoading }) {
  if (!result) return null;

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="flex items-center justify-between mb-5 pr-8">
          <h2 className="font-display text-lg font-semibold text-ink">ATS Resume Score</h2>
          <span className={`font-mono font-bold text-sm px-3 py-1.5 rounded-lg ${scoreColor(result.score)}`}>
            {result.score}%
          </span>
        </div>

        <div className="space-y-5">
          {result.strengths?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate uppercase tracking-wide mb-2">
                <CheckCircle2 size={13} className="text-emerald" /> Strengths
              </p>
              <ul className="space-y-1.5">
                {result.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-ink flex gap-2">
                    <span className="text-emerald">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.issues?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate uppercase tracking-wide mb-2">
                <AlertTriangle size={13} className="text-danger" /> Issues
              </p>
              <ul className="space-y-1.5">
                {result.issues.map((s, i) => (
                  <li key={i} className="text-sm text-ink flex gap-2">
                    <span className="text-danger">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-slate uppercase tracking-wide mb-2">
                <Lightbulb size={13} className="text-amber" /> Suggestions
              </p>
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-sm text-ink flex gap-2">
                    <span className="text-amber">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          onClick={onRecheck}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate hover:text-ink border border-slate/20 rounded-lg py-2.5 mt-6 transition disabled:opacity-50"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> {isLoading ? 'Re-checking...' : 'Re-check score'}
        </button>
      </div>
    </div>
  );
}
