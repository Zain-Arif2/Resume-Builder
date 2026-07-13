import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Features', id: 'features' },
    { label: 'Templates', id: 'templates' },
    { label: 'How it works', id: 'how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-slate/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-semibold text-xl text-ink tracking-tight">
          Resume<span className="text-amber">AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-ink transition">
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
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

        <button onClick={() => setMobileOpen((v) => !v)} className="md:hidden text-ink" aria-label="Toggle menu">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate/10 bg-paper px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { scrollToSection(item.id); setMobileOpen(false); }}
              className="block w-full text-left text-sm font-medium text-slate hover:text-ink transition"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate/10 flex flex-col gap-3">
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-ink">
              Log in
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="bg-ink text-paper text-sm font-medium px-4 py-2.5 rounded-xl text-center hover:bg-ink-light transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
