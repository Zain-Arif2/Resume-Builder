import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper-dim px-6 text-center">
      <span className="font-display text-6xl font-semibold text-ink mb-2">404</span>
      <h1 className="font-display text-xl font-semibold text-ink mb-2">Page not found</h1>
      <p className="text-slate text-sm mb-8 max-w-sm">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-ink-light transition"
      >
        Back to home
      </Link>
    </div>
  );
}
