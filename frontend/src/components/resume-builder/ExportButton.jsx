import { useState, useRef, useEffect } from 'react';
import { Download, FileText, File, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExportButton({ getHtml, baseFileName = 'resume' }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const download = async (format) => {
    setOpen(false);
    setLoading(true);
    try {
      const html = getHtml();
      const endpoint = format === 'pdf' ? '/api/v1/pdf/generate' : '/api/v1/pdf/generate-docx';
      const extension = format === 'pdf' ? 'pdf' : 'docx';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ html, css: '' }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseFileName}.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success(`${extension.toUpperCase()} downloaded`);
    } catch (err) {
      toast.error(`Could not export ${format.toUpperCase()}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={loading}
        className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-xl text-sm font-medium hover:bg-ink-light transition disabled:opacity-50"
      >
        <Download size={15} />
        {loading ? 'Preparing...' : 'Export'}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-paper border border-slate/10 rounded-xl shadow-lg overflow-hidden z-20">
          <button
            onClick={() => download('pdf')}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink hover:bg-paper-dim transition text-left"
          >
            <File size={15} className="text-danger" /> Export as PDF
          </button>
          <button
            onClick={() => download('docx')}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink hover:bg-paper-dim transition text-left border-t border-slate/10"
          >
            <FileText size={15} className="text-amber" /> Export as DOCX
          </button>
        </div>
      )}
    </div>
  );
}
