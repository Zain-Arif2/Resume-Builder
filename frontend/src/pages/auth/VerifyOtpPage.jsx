import { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/features/auth/authApi';
import AuthLayout from '@/layouts/AuthLayout';

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef([]);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();
  const [error, setError] = useState('');
  const [resent, setResent] = useState(false);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(''));
      inputsRef.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const otp = digits.join('');
    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    try {
      await verifyOtp({ email, otp }).unwrap();
      navigate('/login', { state: { verified: true } });
    } catch (err) {
      setError(err?.data?.message || 'Invalid or expired code');
    }
  };

  const handleResend = async () => {
    setError('');
    setResent(false);
    try {
      await resendOtp({ email }).unwrap();
      setResent(true);
    } catch (err) {
      setError(err?.data?.message || 'Could not resend code');
    }
  };

  if (!email) {
    return (
      <AuthLayout>
        <div className="text-center">
          <p className="text-slate text-sm mb-4">No email found. Please register again.</p>
          <Link to="/register" className="text-amber font-semibold hover:underline">Back to sign up</Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-display text-2xl font-semibold text-ink mb-1">Verify your email</h1>
        <p className="text-slate text-sm mb-8">
          We sent a 6-digit code to <span className="font-medium text-ink">{email}</span>
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-danger-dim text-danger text-sm font-medium">{error}</div>
        )}
        {resent && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-emerald-dim text-emerald text-sm font-medium">
            A new code has been sent.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-semibold bg-paper border border-slate/20 rounded-xl focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-ink text-paper py-3 rounded-xl font-medium hover:bg-ink-light disabled:opacity-50 transition"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="text-center text-sm text-slate mt-6">
          Didn't get the code?{' '}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-amber font-semibold hover:underline disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend'}
          </button>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
