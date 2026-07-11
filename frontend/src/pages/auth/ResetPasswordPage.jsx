import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { resetPasswordFormSchema } from '@/features/auth/authSchemas';
import { useResetPasswordMutation } from '@/features/auth/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordFormSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await resetPassword({ token, password: data.password }).unwrap();
      navigate('/login', { state: { registered: false, passwordReset: true } });
    } catch (err) {
      setServerError(err?.data?.message || 'Reset link is invalid or has expired');
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Set a new password</h1>
        <p className="text-slate text-sm mb-8">Choose a strong password you have not used before.</p>

        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-danger-dim text-danger text-sm font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">New Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2.5 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              placeholder="********"
            />
            {errors.password && <p className="text-danger text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full px-4 py-2.5 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              placeholder="********"
            />
            {errors.confirmPassword && (
              <p className="text-danger text-xs mt-1.5">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
          >
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-8">
          <Link to="/login" className="text-amber font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
