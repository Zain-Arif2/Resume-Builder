import { FilePlus2 } from 'lucide-react';

export default function EmptyState({ onCreate, isLoading }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 border border-dashed border-slate/20 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-amber-dim flex items-center justify-center mb-4">
        <FilePlus2 size={22} className="text-amber" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink mb-1">No resumes yet</h3>
      <p className="text-slate text-sm mb-6 max-w-xs">
        Create your first resume and let AI help you write it.
      </p>
      <button
        onClick={onCreate}
        disabled={isLoading}
        className="bg-ink text-paper px-5 py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
      >
        {isLoading ? 'Creating...' : 'Create your first resume'}
      </button>
    </div>
  );
}
