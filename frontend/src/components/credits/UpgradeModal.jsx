import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, X } from 'lucide-react';
import { closeUpgradeModal, selectUpgradeModalOpen } from '@/features/credits/creditSlice';

const perks = [
  'Unlimited AI Resume Generation',
  'Premium Templates',
  'Cover Letter Generator',
  'ATS Optimization',
  'Priority Features',
];

export default function UpgradeModal() {
  const isOpen = useSelector(selectUpgradeModalOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => dispatch(closeUpgradeModal());

  const handleUpgrade = () => {
    dispatch(closeUpgradeModal());
    navigate('/pricing');
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-paper rounded-2xl p-7 max-w-sm w-full relative">
        <button onClick={handleClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-dim flex items-center justify-center mb-4">
          <Sparkles size={22} className="text-amber" />
        </div>

        <h2 className="font-display text-xl font-semibold text-ink mb-2">Upgrade to Pro</h2>
        <p className="text-slate text-sm mb-5 leading-relaxed">
          You have used all of your free AI resume generations. Upgrade to Pro for:
        </p>

        <ul className="space-y-2.5 mb-6">
          {perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2.5 text-sm text-ink">
              <span className="w-5 h-5 rounded-full bg-emerald-dim flex items-center justify-center shrink-0">
                <Check size={12} className="text-emerald" />
              </span>
              {perk}
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 text-slate font-medium py-2.5 rounded-xl border border-slate/20 hover:border-slate/40 transition text-sm"
          >
            Maybe Later
          </button>
          <button
            onClick={handleUpgrade}
            className="flex-1 bg-ink text-paper font-medium py-2.5 rounded-xl hover:bg-ink-light transition text-sm"
          >
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
