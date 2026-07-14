import { Sparkles } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import PlanCard from '@/components/plans/PlanCard';
import { useListActivePlansQuery } from '@/features/plans/planApi';

export default function PricingPage() {
  const { data, isLoading } = useListActivePlansQuery();
  const plans = data?.data?.plans || [];

  const subscriptionPlans = plans.filter((p) => p.type === 'subscription');
  const creditPacks = plans.filter((p) => p.type === 'one_time');

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="font-mono text-xs tracking-wide text-amber bg-amber-dim px-3 py-1 rounded-full mb-4 inline-block">
          PRICING
        </span>
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">Choose your plan</h1>
        <p className="text-slate">Subscribe for unlimited access, or top up with a credit pack anytime.</p>
      </div>

      {subscriptionPlans.length > 0 && (
        <div className="mb-14">
          <h2 className="flex items-center gap-2 font-display font-semibold text-ink mb-5">
            <Sparkles size={17} className="text-amber" /> Subscription
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan._id} plan={plan} highlighted />
            ))}
          </div>
        </div>
      )}

      {creditPacks.length > 0 && (
        <div>
          <h2 className="font-display font-semibold text-ink mb-5">Credit Packs</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
            {creditPacks.map((plan) => (
              <PlanCard key={plan._id} plan={plan} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
