import { Target, RefreshCw, ChevronRight } from 'lucide-react';
import { useAnalyzeGeneralATSMutation } from '@/features/ai/aiApi';

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

function scoreColor(score) {
  if (score >= 75) return { text: 'text-emerald', ring: '#2F9E6E' };
  if (score >= 50) return { text: 'text-amber', ring: '#F2A93B' };
  return { text: 'text-danger', ring: '#E5484D' };
}

export default function ATSScoreWidget({ resumeData, resumeId, result, onResult, onOpenDetails }) {
  const [analyzeGeneralATS, { isLoading }] = useAnalyzeGeneralATSMutation();

  const handleCheck = async (e) => {
    e.stopPropagation();
    const resumeText = buildResumeText(resumeData);
    if (!resumeText.trim()) return;
    const res = await analyzeGeneralATS({ resumeText, resumeId }).unwrap();
    onResult(res.data.analysis);
  };

  if (!result) {
    return (
      <button
        onClick={handleCheck}
        disabled={isLoading}
        className="w-full flex items-center justify-between gap-3 bg-paper border border-dashed border-slate/25 rounded-2xl px-4 py-3.5 hover:border-amber/40 transition text-left disabled:opacity-60"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-dim flex items-center justify-center shrink-0">
            <Target size={16} className="text-amber" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{isLoading ? 'Scoring your resume...' : 'Check your ATS score'}</p>
            <p className="text-xs text-slate">Instant score and improvement tips</p>
          </div>
        </div>
        {isLoading && <RefreshCw size={15} className="text-amber animate-spin shrink-0" />}
      </button>
    );
  }

  const { score, ring, text } = { score: result.score, ...scoreColor(result.score) };
  const circumference = 2 * Math.PI * 17;
  const offset = circumference - (score / 100) * circumference;

  return (
    <button
      onClick={onOpenDetails}
      className="w-full flex items-center justify-between gap-3 bg-paper border border-slate/10 rounded-2xl px-4 py-3.5 hover:border-amber/40 transition text-left"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-9 h-9 shrink-0">
          <svg width="36" height="36" viewBox="0 0 40 40" className="-rotate-90">
            <circle cx="20" cy="20" r="17" fill="none" stroke="#E5E7EB" strokeWidth="4" />
            <circle
              cx="20" cy="20" r="17" fill="none" stroke={ring} strokeWidth="4"
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${text}`}>{score}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">ATS Resume Score</p>
          <p className="text-xs text-slate">View strengths & suggestions</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate shrink-0" />
    </button>
  );
}
