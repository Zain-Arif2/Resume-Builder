import { useState } from 'react';
import { X, Briefcase, HelpCircle } from 'lucide-react';
import { useGenerateInterviewQuestionsMutation, useSuggestCareersMutation } from '@/features/ai/aiApi';

export default function CareerToolsModal({ resumeSummary, skills = [], onClose }) {
  const [tab, setTab] = useState('interview');
  const [role, setRole] = useState('');

  const [generateQuestions, { isLoading: loadingQuestions }] = useGenerateInterviewQuestionsMutation();
  const [questions, setQuestions] = useState([]);

  const [suggestCareers, { isLoading: loadingCareers }] = useSuggestCareersMutation();
  const [suggestions, setSuggestions] = useState([]);

  const handleGenerateQuestions = async () => {
    if (!role.trim()) return;
    const res = await generateQuestions({
      role,
      resumeSummary: resumeSummary || 'Professional with relevant background.',
    }).unwrap();
    setQuestions(res.data.questions);
  };

  const handleSuggestCareers = async () => {
    if (!role.trim()) return;
    const res = await suggestCareers({
      currentRole: role,
      skills: skills.map((s) => s.name),
    }).unwrap();
    setSuggestions(res.data.suggestions);
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-lg w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="flex gap-1 mb-5 bg-paper-dim rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === 'interview' ? 'bg-paper text-ink shadow-sm' : 'text-slate'
            }`}
          >
            <HelpCircle size={14} /> Interview Prep
          </button>
          <button
            onClick={() => setTab('career')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              tab === 'career' ? 'bg-paper text-ink shadow-sm' : 'text-slate'
            }`}
          >
            <Briefcase size={14} /> Career Paths
          </button>
        </div>

        <div className="flex gap-2 mb-5">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={tab === 'interview' ? 'Target role, e.g. Backend Developer' : 'Your current role'}
            className="flex-1 px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
          />
          <button
            onClick={tab === 'interview' ? handleGenerateQuestions : handleSuggestCareers}
            disabled={(tab === 'interview' ? loadingQuestions : loadingCareers) || !role.trim()}
            className="bg-ink text-paper px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-ink-light disabled:opacity-50 transition"
          >
            {tab === 'interview' ? (loadingQuestions ? 'Thinking...' : 'Generate') : (loadingCareers ? 'Thinking...' : 'Suggest')}
          </button>
        </div>

        {tab === 'interview' && questions.length > 0 && (
          <ol className="space-y-2.5 list-decimal list-inside">
            {questions.map((q, i) => (
              <li key={i} className="text-sm text-ink">{q}</li>
            ))}
          </ol>
        )}

        {tab === 'career' && suggestions.length > 0 && (
          <ol className="space-y-2.5 list-decimal list-inside">
            {suggestions.map((s, i) => (
              <li key={i} className="text-sm text-ink">{s}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
