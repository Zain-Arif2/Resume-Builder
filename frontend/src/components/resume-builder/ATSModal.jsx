import { useState, useEffect } from 'react';
import { X, Target } from 'lucide-react';
import { useAnalyzeATSMutation } from '@/features/ai/aiApi';

function buildResumeText(data) {
  const parts = [];
  if (data.professionalSummary) parts.push(data.professionalSummary);
  (data.experience || []).forEach((exp) => {
    parts.push(`${exp.position} at ${exp.company}. ${exp.description || ''}`);
  });
  (data.education || []).forEach((edu) => {
    parts.push(`${edu.degree} ${edu.fieldOfStudy || ''} at ${edu.institution}`);
  });
  if (data.skills?.length) parts.push('Skills: ' + data.skills.map((s) => s.name).join(', '));
  return parts.join('\n');
}

export default function ATSModal({ resumeData, onClose, initialResult, initialJobDescription, onResult }) {
  const [jobDescription, setJobDescription] = useState(initialJobDescription || '');
  const [analyzeATS, { isLoading }] = useAnalyzeATSMutation();
  const [result, setResult] = useState(initialResult || null);

  useEffect(() => {
    if (initialResult) setResult(initialResult);
  }, [initialResult]);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    const resumeText = buildResumeText(resumeData);
    const res = await analyzeATS({ resumeText, jobDescription }).unwrap();
    setResult(res.data.analysis);
    onResult?.(res.data.analysis, jobDescription);
  };

  const scoreColor = (score) => {
    if (score >= 75) return 'text-emerald bg-emerald-dim';
    if (score >= 50) return 'text-amber bg-amber-dim';
    return 'text-danger bg-danger-dim';
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-amber" />
          <h2 className="font-display text-lg font-semibold text-ink">ATS Match Analysis</h2>
        </div>
        <p className="text-slate text-sm mb-5">Paste a job description to see how well your resume matches.</p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          placeholder="Paste the job description here..."
          className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition resize-none mb-4"
        />

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !jobDescription.trim()}
          className="w-full bg-ink text-paper py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition mb-5"
        >
          {isLoading ? 'Analyzing...' : result ? 'Re-analyze' : 'Analyze Match'}
        </button>

        {result && (
          <div className="space-y-4">
            <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${scoreColor(result.matchScore)}`}>
              <span className="font-medium text-sm">Match Score</span>
              <span className="font-mono font-bold text-lg">{result.matchScore}%</span>
            </div>

            {result.matchedKeywords?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">Matched Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchedKeywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-emerald-dim text-emerald px-2 py-1 rounded-md">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {result.missingKeywords?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">Missing Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map((kw, i) => (
                    <span key={i} className="text-xs bg-danger-dim text-danger px-2 py-1 rounded-md">{kw}</span>
                  ))}
                </div>
              </div>
            )}

            {result.suggestions?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">Suggestions</p>
                <ul className="space-y-1.5">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="text-sm text-ink flex gap-2">
                      <span className="text-amber">•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
