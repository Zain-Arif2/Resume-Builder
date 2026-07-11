import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-slate/10 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-display font-semibold text-ink">
          Resume<span className="text-amber">AI</span>
        </Link>
        <p className="text-slate text-sm font-mono">© 2026 ResumeAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
