import { useState } from 'react';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocxExportButton({ getHtml, fileName = 'resume.docx' }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const html = getHtml();

      const res = await fetch('/api/v1/pdf/generate-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ html, css: '' }),
      });

      if (!res.ok) throw new Error('DOCX generation failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('DOCX downloaded');
    } catch (err) {
      toast.error('Could not export DOCX. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 border border-slate/20 text-ink px-4 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition disabled:opacity-50"
    >
      <FileText size={15} /> {loading ? 'Preparing...' : 'Export DOCX'}
    </button>
  );
}
