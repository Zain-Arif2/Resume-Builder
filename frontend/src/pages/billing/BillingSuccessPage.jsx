import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useGetMeQuery } from '@/features/auth/authApi';

export default function BillingSuccessPage() {
  // Refetch the user so the credit badge / plan reflect the new purchase immediately.
  useGetMeQuery();

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-emerald-dim flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-emerald" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Payment successful</h1>
        <p className="text-slate text-sm mb-8">
          Your account has been updated. It may take a few seconds to reflect on your dashboard.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-ink-light transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </DashboardLayout>
  );
}
