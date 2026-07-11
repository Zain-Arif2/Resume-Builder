import { Sparkles } from 'lucide-react';

export default function AIButton({ onClick, isLoading, label = 'Improve with AI' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-amber bg-amber-dim px-3 py-1.5 rounded-lg hover:bg-amber/20 disabled:opacity-50 transition"
    >
      <Sparkles size={13} className={isLoading ? 'animate-pulse' : ''} />
      {isLoading ? 'Thinking...' : label}
    </button>
  );
}
