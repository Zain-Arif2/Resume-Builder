import { X, History, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useListVersionsQuery, useRestoreVersionMutation } from '@/features/resume/resumeApi';

function confirmToast(message) {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink">{message}</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { toast.dismiss(t.id); resolve(false); }}
              className="text-xs font-medium text-slate px-3 py-1.5 rounded-lg border border-slate/20 hover:border-slate/40"
            >
              Cancel
            </button>
            <button
              onClick={() => { toast.dismiss(t.id); resolve(true); }}
              className="text-xs font-medium text-paper bg-ink px-3 py-1.5 rounded-lg hover:bg-ink-light"
            >
              Restore
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  });
}

export default function VersionHistoryModal({ resumeId, onClose, onRestored }) {
  const { data, isLoading } = useListVersionsQuery(resumeId);
  const [restoreVersion, { isLoading: isRestoring }] = useRestoreVersionMutation();

  const versions = data?.data?.versions || [];

  const handleRestore = async (versionNumber) => {
    const ok = await confirmToast(`Restore version ${versionNumber}? Your current changes will be saved as a new version first.`);
    if (!ok) return;
    try {
      await restoreVersion({ id: resumeId, versionNumber }).unwrap();
      toast.success(`Restored to version ${versionNumber}`);
      onRestored?.();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Could not restore version');
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-md w-full relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <History size={18} className="text-amber" />
          <h2 className="font-display text-lg font-semibold text-ink">Version History</h2>
        </div>
        <p className="text-slate text-sm mb-5">Restore a previous version of this resume.</p>

        {isLoading ? (
          <p className="text-slate text-sm">Loading...</p>
        ) : versions.length === 0 ? (
          <p className="text-slate text-sm">No saved versions yet. Versions are created when you save major changes.</p>
        ) : (
          <div className="space-y-2">
            {versions.map((v) => (
              <div key={v._id} className="flex items-center justify-between border border-slate/10 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-ink">Version {v.versionNumber}</p>
                  <p className="text-xs text-slate font-mono">
                    {new Date(v.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {v.changeNote && <p className="text-xs text-slate/70 mt-0.5">{v.changeNote}</p>}
                </div>
                <button
                  onClick={() => handleRestore(v.versionNumber)}
                  disabled={isRestoring}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber bg-amber-dim px-3 py-1.5 rounded-lg hover:bg-amber/20 disabled:opacity-50 transition"
                >
                  <RotateCcw size={12} /> Restore
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
