import { useState } from 'react';
import { X, Target, Check, Copy } from 'lucide-react';
import { useAnalyzeATSMutation } from '@/features/ai/aiApi';

function formatResumeData(data) {
  let text = '';
  
  if (data.personalInfo?.name) {
    text += `${data.personalInfo.name}\n`;
    if (data.personalInfo?.email) text += `${data.personalInfo.email}\n`;
    if (data.personalInfo?.phone) text += `${data.personalInfo.phone}\n`;
    if (data.personalInfo?.location) text += `${data.personalInfo.location}\n`;
    if (data.personalInfo?.linkedin) text += `${data.personalInfo.linkedin}\n`;
    text += '\n';
  }
  
  if (data.professionalSummary) {
    text += `Professional Summary\n${data.professionalSummary}\n\n`;
  }
  
  if (data.experience?.length > 0) {
    text += `Experience\n`;
    data.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company}\n`;
      text += `${exp.startDate} - ${exp.endDate || 'Present'}\n`;
      if (exp.description) text += `${exp.description}\n`;
      text += '\n';
    });
  }
  
  if (data.education?.length > 0) {
    text += `Education\n`;
    data.education.forEach(edu => {
      text += `${edu.degree}${edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}\n`;
      text += `${edu.school || edu.institution}\n`;
      text += `${edu.startDate} - ${edu.endDate}\n\n`;
    });
  }
  
  if (data.skills?.length > 0) {
    text += `Skills\n`;
    text += data.skills.map(skill => typeof skill === 'string' ? skill : skill.name).join(', ') + '\n\n';
  }
  
  if (data.projects?.length > 0) {
    text += `Projects\n`;
    data.projects.forEach(proj => {
      text += `${proj.title}\n`;
      if (proj.techStack) text += `${proj.techStack}\n`;
      if (proj.description) text += `${proj.description}\n`;
      text += '\n';
    });
  }
  
  if (data.certifications?.length > 0) {
    text += `Certifications\n`;
    data.certifications.forEach(cert => {
      text += `${cert.title} - ${cert.organization}\n`;
      if (cert.issueDate) text += `${cert.issueDate}\n`;
    });
    text += '\n';
  }
  
  return text;
}

export default function ATSModal({ resumeData, onClose }) {
  const [jobDescription, setJobDescription] = useState('');
  const [analyzeATS, { isLoading, data: analysisResult }] = useAnalyzeATSMutation();
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return;
    await analyzeATS({
      resumeText: formatResumeData(resumeData),
      jobDescription
    }).unwrap();
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-2xl w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Target size={18} className="text-amber" />
          <h2 className="font-display text-lg font-semibold text-ink">ATS Match Analyzer</h2>
        </div>
        <p className="text-slate text-sm mb-5">Paste a job description to see how well your resume matches.</p>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition mb-4 min-h-[150px] resize-y"
        />

        <button
          onClick={handleAnalyze}
          disabled={isLoading || !jobDescription.trim()}
          className="w-full bg-ink text-paper py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition mb-5"
        >
          {isLoading ? 'Analyzing...' : 'Analyze ATS Match'}
        </button>

        {analysisResult?.data && (
          <div className="space-y-4">
            {/* Match Score */}
            <div className="flex items-center gap-3 p-4 bg-paper-dim border border-slate/10 rounded-xl">
              <div className="text-3xl font-display font-bold text-amber">
                {analysisResult.data.matchScore || 0}%
              </div>
              <div className="text-sm text-slate">ATS Match Score</div>
            </div>

            {/* Matched Keywords */}
            {analysisResult.data.matchedKeywords?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.data.matchedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald/10 text-emerald text-xs font-medium rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {analysisResult.data.missingKeywords?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.data.missingKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red/10 text-red text-xs font-medium rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysisResult.data.suggestions?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-ink mb-2">Suggestions</h3>
                <ul className="space-y-2 text-sm text-slate">
                  {analysisResult.data.suggestions.map((sugg, idx) => (
                    <li key={idx} className="flex gap-2 items-start">
                      <span className="text-amber mt-1">•</span>
                      <span>{sugg}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => handleCopy(JSON.stringify(analysisResult.data, null, 2))}
              className="flex items-center gap-1.5 text-amber hover:text-amber/80 transition text-sm font-medium"
            >
              {copied ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
              {copied ? 'Copied!' : 'Copy Full Analysis'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
