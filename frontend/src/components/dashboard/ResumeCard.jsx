import { Link } from 'react-router-dom';
import { Copy, Trash2, FileText } from 'lucide-react';

export default function ResumeCard({ resume, onDelete, onDuplicate }) {
  const updatedAt = new Date(resume.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group bg-paper border border-slate/10 rounded-2xl p-5 hover:border-amber/40 hover:shadow-md transition">
      <Link to={`/resume/${resume._id}/edit`} className="block">
        <div className="w-full aspect-[4/5] bg-paper-dim rounded-xl mb-4 flex items-center justify-center border border-slate/10">
          <FileText size={32} className="text-slate/30" />
        </div>
        <h3 className="font-display font-semibold text-ink truncate mb-1">{resume.title}</h3>
        <p className="text-slate text-xs font-mono">Edited {updatedAt}</p>
      </Link>

      <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition">
        <button
          onClick={() => onDuplicate(resume._id)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-slate hover:text-ink border border-slate/20 rounded-lg py-2 transition"
        >
          <Copy size={13} /> Duplicate
        </button>
        <button
          onClick={() => onDelete(resume._id)}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-danger hover:bg-danger-dim border border-danger/20 rounded-lg py-2 transition"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </div>
  );
}
