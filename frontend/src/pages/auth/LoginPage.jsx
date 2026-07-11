import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { loginFormSchema } from '@/features/auth/authSchemas';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import AuthLayout from '@/layouts/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginFormSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await loginUser(data).unwrap();
      dispatch(setCredentials({ user: result.data.user }));
      navigate('/dashboard');
    } catch (err) {
      setServerError(err?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h1>
        <p className="text-slate text-sm mb-8">Log in to keep building your resume.</p>

        {location.state?.registered && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-dim text-emerald text-sm font-medium">
            Account created, log in to continue.
          </div>
        )}

        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-danger-dim text-danger text-sm font-medium">
            {serverError}
          </div>
        )}

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

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-ink">Password</label>
              <Link to="/forgot-password" className="text-xs text-amber hover:underline font-medium">
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2.5 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              placeholder="********"
            />
            {errors.password && <p className="text-danger text-xs mt-1.5">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-amber font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
