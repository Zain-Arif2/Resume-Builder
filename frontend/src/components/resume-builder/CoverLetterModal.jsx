import { useState } from 'react';
import { X, Mail, Copy, Check } from 'lucide-react';
import { useGenerateCoverLetterMutation } from '@/features/ai/aiApi';

export default function CoverLetterModal({ resumeSummary, onClose }) {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [generateCoverLetter, { isLoading }] = useGenerateCoverLetterMutation();
  const [letter, setLetter] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!role.trim() || !company.trim()) return;
    const res = await generateCoverLetter({
      role,
      company,
      resumeSummary: resumeSummary || 'Motivated professional with relevant experience.',
    }).unwrap();
    setLetter(res.data.coverLetter);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Mail size={18} className="text-amber" />
          <h2 className="font-display text-lg font-semibold text-ink">Cover Letter Generator</h2>
        </div>
        <p className="text-slate text-sm mb-5">Generate a tailored cover letter in seconds.</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
          />
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !role.trim() || !company.trim()}
          className="w-full bg-ink text-paper py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition mb-5"
        >
          {isLoading ? 'Writing...' : 'Generate Cover Letter'}
        </button>

        {letter && (
          <div className="relative">
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 text-slate hover:text-ink transition bg-paper rounded-lg p-1.5"
            >
              {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
            </button>
            <div className="bg-paper-dim border border-slate/10 rounded-xl p-4 text-sm text-ink whitespace-pre-wrap leading-relaxed">
              {letter}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
