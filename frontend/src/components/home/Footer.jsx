import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Templates', href: '#templates' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Pricing', to: '/register' },
  ],
  Company: [
    { label: 'About', to: '/' },
    { label: 'Careers', to: '/' },
    { label: 'Blog', to: '/' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/' },
    { label: 'Terms of Service', to: '/' },
  ],
};

function scrollToSection(href) {
  const id = href.replace('#', '');
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
  });
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          {/* Logo */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-display text-2xl font-bold tracking-tight text-slate-900"
            >
              Resume<span className="text-amber-500">AI</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
              AI-powered resume builder with ATS scoring, professional
              templates, and smart suggestions to help you land interviews
              faster.
            </p>

            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-amber-500 hover:text-amber-500"
              >
                <Twitter size={18} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-amber-500 hover:text-amber-500"
              >
                <Linkedin size={18} />
              </a>

              <a
                href="#"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-amber-500 hover:text-amber-500"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {heading}
              </h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-sm text-slate-600 transition hover:text-amber-500"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-slate-600 transition hover:text-amber-500"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-center sm:flex-row">
          <p className="text-xs text-slate-500">
            © 2026 ResumeAI. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Made for job seekers who want to move faster
          </p>
        </div>
      </div>
    </footer>
  );
}