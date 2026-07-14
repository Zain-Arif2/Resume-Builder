import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';
import { updateProfileFormSchema } from '@/features/auth/authSchemas';
import { useUpdateProfileMutation } from '@/features/auth/authApi';
import { selectCurrentUser, setCredentials } from '@/features/auth/authSlice';
import DashboardLayout from '@/layouts/DashboardLayout';

const perks = [
  'Unlimited AI Resume Generation',
  'Premium Templates',
  'Cover Letter Generator',
  'ATS Optimization',
  'Priority Features',
];

export default function ProfilePage() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileFormSchema),
    defaultValues: { name: user?.name || '' },
  });

  const onSubmit = async (data) => {
    setSuccess(false);
    const result = await updateProfile(data).unwrap();
    dispatch(setCredentials({ user: result.data.user }));
    setSuccess(true);
  };

  const isPro = user?.plan === 'pro';

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Profile</h1>
        <p className="text-slate text-sm">Manage your account details and subscription.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* Account details */}
        <div className="lg:col-span-3 bg-paper border border-slate/10 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-ink mb-5">Account Details</h2>

          {success && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-dim text-emerald text-sm font-medium">
              Profile updated successfully.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-2.5 bg-paper-dim border border-slate/20 rounded-xl text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              {errors.name && <p className="text-danger text-xs mt-1.5">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 bg-paper-dim border border-slate/10 rounded-xl text-slate cursor-not-allowed"
              />
              <p className="text-slate/60 text-xs mt-1.5">Email cannot be changed.</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-ink text-paper px-5 py-2.5 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
            >
              {isLoading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Subscription */}
        <div className="lg:col-span-2 bg-paper border border-slate/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-ink">Subscription</h2>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md shrink-0 ${
                isPro ? 'bg-emerald-dim text-emerald' : 'bg-paper-dim text-slate'
              }`}
            >
              {isPro ? 'PRO' : 'FREE'}
            </span>
          </div>

          {isPro ? (
            <div className="space-y-4">
              <div className="bg-emerald-dim rounded-xl p-4">
                <p className="text-emerald text-sm font-medium flex items-center gap-2">
                  <Sparkles size={15} /> Unlimited generations active
                </p>
              </div>
              <p className="text-slate text-sm">
                Total resumes generated: <span className="font-semibold text-ink">{user?.totalResumeGenerated ?? 0}</span>
              </p>
            </div>
          ) : (
            <>
              <div className="bg-paper-dim rounded-xl p-4 mb-5">
                <p className="text-xs text-slate mb-1">Remaining credits</p>
                <p className="font-display text-2xl font-semibold text-ink">
                  {user?.resumeCredits ?? 0} <span className="text-sm text-slate font-normal">/ 2</span>
                </p>
              </div>

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

              <Link
                to="/pricing"
                className="flex items-center justify-center gap-2 bg-ink text-paper px-5 py-2.5 rounded-xl font-medium hover:bg-ink-light transition text-sm w-full"
              >
                <Sparkles size={15} /> View Plans
              </Link>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
