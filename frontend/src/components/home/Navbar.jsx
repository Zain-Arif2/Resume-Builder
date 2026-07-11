import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-slate/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-xl text-ink tracking-tight">
          Resume<span className="text-amber">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
          <a href="#features" className="hover:text-ink transition">Features</a>
          <a href="#templates" className="hover:text-ink transition">Templates</a>
          <a href="#how-it-works" className="hover:text-ink transition">How it works</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-slate hover:text-ink transition">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-ink text-paper text-sm font-medium px-4 py-2 rounded-xl hover:bg-ink-light transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
