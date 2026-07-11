import { useParams, Link } from 'react-router-dom';
import { useGetPublicResumeQuery } from '@/features/resume/resumeApi';
import ResumePreview from '@/components/resume-builder/ResumePreview';
import PageLoader from '@/components/common/PageLoader';

export default function PublicResumePage() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetPublicResumeQuery(slug);

  if (isLoading) return <PageLoader />;

  if (isError || !data?.data?.resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper-dim px-6 text-center">
        <h1 className="font-display text-xl font-semibold text-ink mb-2">Resume not available</h1>
        <p className="text-slate text-sm mb-6">This link may be expired or the resume is no longer public.</p>
        <Link to="/" className="bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-ink-light transition">
          Go to ResumeAI
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper-dim py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <ResumePreview data={data.data.resume} />
        <p className="text-center text-slate text-xs font-mono mt-6">
          Built with <Link to="/" className="text-amber hover:underline">ResumeAI</Link>
        </p>
      </div>
    </div>
  );
}
