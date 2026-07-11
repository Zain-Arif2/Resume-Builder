import { motion } from 'framer-motion';

const linkedInLines = [
  { width: '72%' },
  { width: '88%' },
  { width: '60%' },
  { width: '80%' },
];

export default function AuthShowcase() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between h-full w-full bg-gradient-to-br from-ink to-ink-light text-paper p-12 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />

      <div className="relative z-10">
        <span className="font-display font-semibold text-xl tracking-tight">
          Resume<span className="text-amber">AI</span>
        </span>
      </div>

      <div className="relative z-10 space-y-8">
        <h2 className="font-display text-3xl font-semibold leading-tight max-w-sm">
          Every line, tuned to pass the screen and the person reading it.
        </h2>

        <div className="bg-paper/5 border border-paper/10 rounded-2xl p-6 backdrop-blur-sm max-w-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="h-3 w-24 bg-paper/20 rounded-full" />
            <span className="font-mono text-xs text-emerald bg-emerald-dim/10 border border-emerald/30 px-2 py-1 rounded-md">
              92% Match
            </span>
          </div>

          <div className="space-y-3">
            {linkedInLines.map((line, i) => (
              <div key={i} className="relative h-2.5 rounded-full bg-paper/10 overflow-hidden" style={{ width: line.width }}>
                {i === 1 && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-amber/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.1, delay: 0.6, ease: 'easeInOut' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-paper/50 text-sm max-w-xs">
          AI-drafted summaries, ATS scoring, and version history, built for people who take their next role seriously.
        </p>
      </div>

      <div className="relative z-10 text-paper/30 text-xs font-mono">(c) 2026 ResumeAI</div>
    </div>
  );
}
