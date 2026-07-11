import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { registerFormSchema } from '@/features/auth/authSchemas';
import { useRegisterMutation } from '@/features/auth/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerFormSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await registerUser(data).unwrap();
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setServerError(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Create your account</h1>
        <p className="text-slate text-sm mb-8">Start building your AI-powered resume.</p>

        {serverError && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-danger-dim text-danger text-sm font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">Full Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-4 py-2.5 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-danger text-xs mt-1.5">{errors.name.message}</p>}
          </div>

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
            <label className="block text-sm font-medium text-ink mb-1.5">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-4 py-2.5 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              placeholder="********"
            />
            {errors.password && <p className="text-danger text-xs mt-1.5">{errors.password.message}</p>}
            <p className="text-slate/60 text-xs mt-1.5">At least 8 characters, one uppercase letter, one number.</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-amber font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
