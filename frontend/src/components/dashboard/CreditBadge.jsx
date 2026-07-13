import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { selectCurrentUser } from '@/features/auth/authSlice';

export default function CreditBadge() {
  const user = useSelector(selectCurrentUser);
  if (!user) return null;

  if (user.plan === 'pro') {
    return (
      <div className="flex items-center gap-2 bg-emerald-dim text-emerald px-3.5 py-2 rounded-xl text-sm font-medium">
        <Sparkles size={14} /> Pro Plan — Unlimited
      </div>
    );
  }

  const remaining = user.resumeCredits ?? 0;
  const isLow = remaining === 0;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium ${
          isLow ? 'bg-danger-dim text-danger' : 'bg-amber-dim text-ink'
        }`}
      >
        <Sparkles size={14} className={isLow ? 'text-danger' : 'text-amber'} />
        Free Plan — {remaining} / 2 credits
      </div>
      {isLow && (
        <Link
          to="/profile"
          className="text-xs font-semibold text-amber hover:underline"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}
