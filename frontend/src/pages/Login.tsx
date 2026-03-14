import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, LogIn, Mail, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both your email and password.');
        return;
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (!err.response) {
          setError('Cannot reach the server. Please try again later.');
        } else {
          setError(err.response?.data?.message || 'Login failed. Check your credentials.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setInfo('');

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError('Enter your email first, then click Forgot password.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await authService.forgotPassword(normalizedEmail);
      setInfo(res?.message || 'If the email exists, a reset link has been sent.');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else if (!err.response) {
          setError('Cannot reach the server. Please try again later.');
        } else {
          setError(err.response?.data?.message || 'Unable to send reset email right now. Please try again later.');
        }
      } else {
        setError('Unable to send reset email right now. Please try again later.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Floating background orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        onClick={() => navigate('/')}
        className="relative z-10 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors text-slate-600 dark:text-gray-400 border border-black/10 dark:border-white/10 bg-white/50 dark:bg-slate-800/50 hover:border-primary/50 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </motion.button>

      {/* Main card */}
      <div className="relative z-10 mx-auto mt-8 flex w-full max-w-md items-center justify-center flex-1">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="auth-card w-full"
        >
          {/* Header */}
          <motion.div className="mb-8 text-center" custom={0} initial="hidden" animate="visible" variants={fadeUp}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white dark:text-black bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/25">
              4
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Welcome Back</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Sign In</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Access your student or company dashboard</p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="auth-error mb-5"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {info && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            >
              {info}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="auth-label" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
              <div className="flex items-center justify-between">
                <label className="auth-label" htmlFor="login-password">Password</label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="text-xs font-medium text-primary hover:underline hover:underline-offset-2 mb-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? 'Sending...' : 'Forgot password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="auth-input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
              <button
                type="submit"
                disabled={loading}
                className="auth-submit mt-1"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer link */}
          <motion.p custom={4} initial="hidden" animate="visible" variants={fadeUp} className="mt-7 text-center text-sm text-slate-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="auth-link">
              Create account
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
