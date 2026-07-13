import { FileEdit, Sparkles, Download } from 'lucide-react';

const steps = [
  {
    icon: FileEdit,
    step: '01',
    title: 'Fill in your details',
    description: 'Add your experience, education, and skills using our guided builder, or import from an existing resume.',
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Let AI sharpen it',
    description: 'Generate a summary, rewrite bullet points, and check your ATS match score against any job description.',
  },
  {
    icon: Download,
    step: '03',
    title: 'Export and apply',
    description: 'Download as a polished PDF, or share a live link with a QR code, ready to send to any employer.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-paper-dim py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="font-mono text-xs tracking-wide text-amber bg-amber-dim px-3 py-1 rounded-full mb-4 inline-block">
            HOW IT WORKS
          </span>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Three steps between you and your next interview.
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map(({ icon: Icon, step, title, description }, i) => (
            <div key={step} className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-ink flex items-center justify-center shrink-0">
                  <Icon size={19} className="text-amber" />
                </div>
                <span className="font-mono text-3xl font-semibold text-slate/15">{step}</span>
              </div>
              <h3 className="font-display font-semibold text-ink text-lg mb-2">{title}</h3>
              <p className="text-slate text-sm leading-relaxed">{description}</p>

              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute top-5 left-full w-8 h-px bg-slate/15 -translate-x-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
