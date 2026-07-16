import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/DashboardLayout';
import ResumeCard from '@/components/dashboard/ResumeCard';
import EmptyState from '@/components/dashboard/EmptyState';
import PageLoader from '@/components/common/PageLoader';
import {
  useListResumesQuery,
  useCreateResumeMutation,
  useDeleteResumeMutation,
  useDuplicateResumeMutation,
} from '@/features/resume/resumeApi';

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
              className="text-xs font-medium text-paper bg-danger px-3 py-1.5 rounded-lg hover:opacity-90"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 10000 }
    );
  });
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useListResumesQuery({ page: 1, limit: 20 });
  const [createResume, { isLoading: isCreating }] = useCreateResumeMutation();
  const [deleteResume] = useDeleteResumeMutation();
  const [duplicateResume] = useDuplicateResumeMutation();

  const resumes = data?.data?.resumes || [];

  const handleCreate = async () => {
    try {
      const result = await createResume({ title: 'Untitled Resume' }).unwrap();
      navigate(`/resume/${result.data.resume._id}/edit`);
    } catch (err) {
      toast.error(err?.data?.message || 'Could not create resume');
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirmToast('Delete this resume? This cannot be undone.');
    if (!ok) return;
    try {
      await deleteResume(id).unwrap();
      toast.success('Resume deleted');
    } catch (err) {
      toast.error(err?.data?.message || 'Could not delete resume');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateResume(id).unwrap();
      toast.success('Resume duplicated');
    } catch (err) {
      toast.error(err?.data?.message || 'Could not duplicate resume');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-semibold text-ink">Your Resumes</h1>
          <p className="text-slate text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
        </div>
        {resumes.length > 0 && (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center justify-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition text-sm shrink-0"
          >
            <Plus size={16} /> New Resume
          </button>
        )}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : resumes.length === 0 ? (
        <EmptyState onCreate={handleCreate} isLoading={isCreating} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {resumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
