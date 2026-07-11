import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { forgotPasswordFormSchema } from '@/features/auth/authSchemas';
import { useForgotPasswordMutation } from '@/features/auth/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordFormSchema) });

  const onSubmit = async (data) => {
    await forgotPassword(data).unwrap().catch(() => {});
    setSubmitted(true);
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Reset your password</h1>
        <p className="text-slate text-sm mb-8">
          Enter your email and we will send you a link to reset your password.
        </p>

        {submitted ? (
          <div className="px-4 py-3 rounded-xl bg-emerald-dim text-emerald text-sm font-medium">
            If an account exists for that email, a reset link is on its way.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-2.5 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-danger text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate mt-8">
          Remembered your password?{' '}
          <Link to="/login" className="text-amber font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
