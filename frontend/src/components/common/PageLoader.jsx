export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-dim">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-slate/20 border-t-amber rounded-full animate-spin" />
        <p className="font-mono text-xs text-slate">Loading...</p>
      </div>
    </div>
  );
}
