import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const lines = [
  { width: '85%', highlight: false },
  { width: '65%', highlight: true },
  { width: '92%', highlight: false },
  { width: '55%', highlight: false },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber/10 rounded-full blur-3xl" />
      <div className="absolute top-40 -left-24 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block font-mono text-xs tracking-wide text-emerald bg-emerald-dim px-3 py-1 rounded-full mb-6">
            AI RESUME BUILDER
          </span>

          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-ink leading-tight mb-6">
            Every line, tuned to pass the screen and the person reading it.
          </h1>

          <p className="text-slate text-lg mb-8 max-w-md">
            Draft summaries, rewrite bullet points, and score your resume against any job description, all with AI that knows what recruiters actually look for.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-ink-light transition"
            >
              Build my resume <ArrowRight size={16} />
            </Link>
            
              href="#how-it-works"
              className="text-ink font-medium px-6 py-3 rounded-xl border border-slate/20 hover:border-slate/40 transition"
            >
              See how it works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="bg-ink rounded-2xl p-7 shadow-xl max-w-md ml-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-paper/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-paper/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-paper/20" />
              </div>
              <span className="font-mono text-xs text-emerald bg-emerald-dim/10 border border-emerald/30 px-2 py-1 rounded-md">
                92% Match
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="relative h-3 rounded-full bg-paper/10 overflow-hidden"
                  style={{ width: line.width }}
                >
                  {line.highlight && (
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-amber/70 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.8, ease: 'easeInOut' }}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="font-mono text-[11px] text-amber bg-amber-dim/10 border border-amber/30 px-2 py-1 rounded-md">
                Grammar improved
              </span>
              <span className="font-mono text-[11px] text-paper/60 bg-paper/5 border border-paper/10 px-2 py-1 rounded-md">
                v4 saved
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
