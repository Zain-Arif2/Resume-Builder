import { useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { useCreateCheckoutSessionMutation } from '@/features/payments/paymentApi';

export default function PlanCard({ plan, highlighted = false }) {
  const [createCheckoutSession, { isLoading }] = useCreateCheckoutSessionMutation();
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    setError('');
    try {
      const result = await createCheckoutSession(plan._id).unwrap();
      window.location.href = result.data.url;
    } catch (err) {
      setError(err?.data?.message || 'Could not start checkout. Please try again.');
    }
  };

  return (
    <div
      className={`relative rounded-2xl p-6 border transition ${
        highlighted ? 'border-amber bg-ink text-paper shadow-lg' : 'border-slate/10 bg-paper text-ink'
      }`}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 bg-amber text-ink text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}

      <div className="flex items-center gap-2 mb-1">
        {plan.type === 'subscription' && <Sparkles size={16} className={highlighted ? 'text-amber' : 'text-amber'} />}
        <h3 className="font-display font-semibold text-lg">{plan.name}</h3>
      </div>

      <div className="flex items-baseline gap-1 my-4">
        <span className="text-3xl font-bold">${plan.priceUSD}</span>
        {plan.type === 'subscription' && (
          <span className={`text-sm ${highlighted ? 'text-paper/60' : 'text-slate'}`}>/{plan.interval}</span>
        )}
      </div>

      <p className={`text-sm mb-5 ${highlighted ? 'text-paper/70' : 'text-slate'}`}>{plan.description}</p>

      <ul className="space-y-2 mb-6 text-sm">
        {plan.type === 'subscription' ? (
          <>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald shrink-0" /> Unlimited AI generations
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald shrink-0" /> Premium templates
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald shrink-0" /> Cover letter generator
            </li>
            <li className="flex items-center gap-2">
              <Check size={14} className="text-emerald shrink-0" /> ATS optimization
            </li>
          </>
        ) : (
          <li className="flex items-center gap-2">
            <Check size={14} className="text-emerald shrink-0" /> {plan.credits} AI resume credits
          </li>
        )}
      </ul>

      {error && <p className="text-danger text-xs mb-3">{error}</p>}

      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className={`w-full py-2.5 rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 disabled:opacity-60 ${
          highlighted ? 'bg-amber text-ink hover:bg-amber/90' : 'bg-ink text-paper hover:bg-ink-light'
        }`}
      >
        {isLoading ? <Loader2 size={15} className="animate-spin" /> : null}
        {isLoading ? 'Redirecting...' : plan.type === 'subscription' ? 'Subscribe' : 'Buy Credits'}
      </button>
    </div>
  );
}
