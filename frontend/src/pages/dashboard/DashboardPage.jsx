import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
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

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useListResumesQuery({ page: 1, limit: 20 });
  const [createResume, { isLoading: isCreating }] = useCreateResumeMutation();
  const [deleteResume] = useDeleteResumeMutation();
  const [duplicateResume] = useDuplicateResumeMutation();

  const resumes = data?.data?.resumes || [];

  const handleCreate = async () => {
    const result = await createResume({ title: 'Untitled Resume' }).unwrap();
    navigate(`/resume/${result.data.resume._id}/edit`);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this resume? This cannot be undone.')) {
      await deleteResume(id);
    }
  };

  const handleDuplicate = async (id) => {
    await duplicateResume(id);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Your Resumes</h1>
          <p className="text-slate text-sm mt-1">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
        </div>
        {resumes.length > 0 && (
          <button
            onClick={handleCreate}
            disabled={isCreating}
            className="flex items-center gap-2 bg-ink text-paper px-4 py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
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
