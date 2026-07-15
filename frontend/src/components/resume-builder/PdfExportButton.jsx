import { useState } from 'react';
import { Download } from 'lucide-react';

export default function PdfExportButton({ getHtml, fileName = 'resume.pdf' }) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const html = getHtml();

      const res = await fetch('/api/v1/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ html, css: '' }),
      });

      if (!res.ok) throw new Error('PDF generation failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not export PDF. Please try again.');
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
      <Download size={15} /> {loading ? 'Preparing...' : 'Export PDF'}
    </button>
  );
}
