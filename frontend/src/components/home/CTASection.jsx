import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-ink py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-paper mb-4">
          Stop guessing what recruiters want.
        </h2>
        <p className="text-paper/60 mb-8 max-w-lg mx-auto">
          Create a free account, paste a job description, and let ResumeAI show you exactly where your resume falls short, and fix it.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 bg-amber text-ink px-6 py-3 rounded-xl font-medium hover:bg-amber/90 transition"
        >
          Build my resume <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
