import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthShowcase from '@/components/auth/AuthShowcase';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-paper-dim">
      <AuthShowcase />

      <div className="flex flex-col min-h-screen">
        <div className="lg:hidden flex items-center justify-between px-6 h-16 border-b border-slate/10 bg-paper">
          <Link to="/" className="flex items-center gap-2 text-slate hover:text-ink transition">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <span className="font-display font-semibold text-ink tracking-tight">
            Resume<span className="text-amber">AI</span>
          </span>
          <span className="w-12" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
