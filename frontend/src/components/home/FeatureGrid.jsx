import { Sparkles, Target, PenLine, Mail, History, Download } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Professional Summary',
    description: 'Draft a summary tailored to the exact role you are applying for, in seconds.',
  },
  {
    icon: Target,
    title: 'ATS Match Scoring',
    description: 'See how your resume scores against a job description before you hit apply.',
  },
  {
    icon: PenLine,
    title: 'Bullet Point Rewrites',
    description: 'Turn flat job duties into clear, achievement-driven bullet points.',
  },
  {
    icon: Mail,
    title: 'Cover Letter Generator',
    description: 'Pair every resume with a matching cover letter, written in your voice.',
  },
  {
    icon: History,
    title: 'Version History',
    description: 'Every edit is saved automatically. Roll back to any previous version, anytime.',
  },
  {
    icon: Download,
    title: 'One-Click Export',
    description: 'Download as PDF or DOCX, or share a live link with a QR code.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="bg-paper-dim py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="font-mono text-xs tracking-wide text-amber bg-amber-dim px-3 py-1 rounded-full mb-4 inline-block">
            WHAT RESUMEAI DOES
          </span>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Built for the parts of job hunting that actually take time.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-paper border border-slate/10 rounded-2xl p-6 hover:border-amber/40 hover:shadow-md transition"
            >
              <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center mb-4">
                <Icon size={18} className="text-amber" />
              </div>
              <h3 className="font-display font-semibold text-ink mb-2">{title}</h3>
              <p className="text-slate text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
