import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { updateProfileFormSchema } from '@/features/auth/authSchemas';
import { useUpdateProfileMutation } from '@/features/auth/authApi';
import { selectCurrentUser, setCredentials } from '@/features/auth/authSlice';
import DashboardLayout from '@/layouts/DashboardLayout';

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

  return (
    <DashboardLayout>
      <div className="max-w-lg">
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Profile</h1>
        <p className="text-slate text-sm mb-8">Manage your account details.</p>

        <div className="bg-paper border border-slate/10 rounded-2xl p-6">
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
      </div>
    </DashboardLayout>
  );
}
