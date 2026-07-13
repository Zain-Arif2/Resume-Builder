import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const templates = [
  { id: 'classic', name: 'Classic', accent: '#5B6472', description: 'Clean, traditional single-column layout' },
  { id: 'creative', name: 'Creative', accent: '#6366F1', description: 'Two-column layout with sidebar and accent color' },
  { id: 'executive', name: 'Executive', accent: '#2F9E6E', description: 'Bold headings, polished senior-level feel' },
  { id: 'minimal', name: 'Minimal', accent: '#14171F', description: 'Understated, typography-first design' },
];

function TemplateMockup({ accent, variant }) {
  if (variant === 'sidebar') {
    return (
      <div className="w-full h-full flex bg-white">
        <div className="w-1/3 bg-paper-dim p-3 space-y-2">
          <div className="w-8 h-8 rounded-full" style={{ backgroundColor: accent, opacity: 0.2 }} />
          <div className="h-1.5 w-full rounded-full bg-slate/15" />
          <div className="h-1.5 w-3/4 rounded-full bg-slate/15" />
        </div>
        <div className="flex-1 p-3 space-y-2">
          <div className="h-2.5 w-2/3 rounded-full" style={{ backgroundColor: accent }} />
          <div className="h-1.5 w-full rounded-full bg-slate/10" />
          <div className="h-1.5 w-full rounded-full bg-slate/10" />
          <div className="h-1.5 w-4/5 rounded-full bg-slate/10" />
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="w-full h-full bg-white">
        <div className="h-1/4 flex items-center px-3" style={{ backgroundColor: accent }}>
          <div className="h-1.5 w-1/2 rounded-full bg-white/70" />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-1.5 w-full rounded-full bg-slate/10" />
          <div className="h-1.5 w-full rounded-full bg-slate/10" />
          <div className="h-1.5 w-3/4 rounded-full bg-slate/10" />
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="w-full h-full bg-white flex flex-col items-center p-4 space-y-2">
        <div className="h-2 w-1/2 rounded-full" style={{ backgroundColor: accent }} />
        <div className="h-1 w-1/3 rounded-full bg-slate/15" />
        <div className="w-full h-px bg-slate/10 my-1" />
        <div className="h-1.5 w-full rounded-full bg-slate/10" />
        <div className="h-1.5 w-full rounded-full bg-slate/10" />
        <div className="h-1.5 w-2/3 rounded-full bg-slate/10" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-3 space-y-2">
      <div className="h-2.5 w-1/2 rounded-full" style={{ backgroundColor: accent }} />
      <div className="h-1 w-1/3 rounded-full bg-slate/15" />
      <div className="w-full h-px bg-slate/10 my-1.5" />
      <div className="h-1.5 w-full rounded-full bg-slate/10" />
      <div className="h-1.5 w-full rounded-full bg-slate/10" />
      <div className="h-1.5 w-4/5 rounded-full bg-slate/10" />
    </div>
  );
}

const variantMap = { classic: 'classic', creative: 'sidebar', executive: 'banner', minimal: 'minimal' };

export default function TemplatesShowcase() {
  return (
    <section id="templates" className="bg-paper py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="font-mono text-xs tracking-wide text-emerald bg-emerald-dim px-3 py-1 rounded-full mb-4 inline-block">
            RESUME TEMPLATES
          </span>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Pick a look that matches how you want to be read.
          </h2>
          <p className="text-slate mt-3">
            Switch templates anytime, your content stays the same, only the layout changes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((t) => (
            <div key={t.id} className="group">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-slate/10 shadow-sm group-hover:shadow-md group-hover:border-amber/40 transition">
                <TemplateMockup accent={t.accent} variant={variantMap[t.id]} />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.accent }} />
                <p className="font-display font-semibold text-ink text-sm">{t.name}</p>
              </div>
              <p className="text-slate text-xs mt-1">{t.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 text-ink font-medium hover:text-amber transition"
          >
            Try every template free <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
