import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function BillingCancelledPage() {
  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-danger-dim flex items-center justify-center mx-auto mb-5">
          <XCircle size={32} className="text-danger" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">Checkout cancelled</h1>
        <p className="text-slate text-sm mb-8">No charge was made. You can try again anytime.</p>
        <Link
          to="/pricing"
          className="inline-block bg-ink text-paper px-6 py-3 rounded-xl font-medium hover:bg-ink-light transition"
        >
          Back to Pricing
        </Link>
      </div>
    </DashboardLayout>
  );
}
