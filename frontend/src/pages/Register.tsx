import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Check, Eye, EyeOff, GraduationCap, Lock, Mail, User, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 20, label: 'Very Weak', color: '#ef4444' };
  if (score === 2) return { score: 40, label: 'Weak', color: '#f97316' };
  if (score === 3) return { score: 60, label: 'Fair', color: '#eab308' };
  if (score === 4) return { score: 80, label: 'Strong', color: '#22c55e' };
  return { score: 100, label: 'Very Strong', color: '#06b6d4' };
}

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      if (!trimmedName || !trimmedEmail || !password) {
        setError('All fields are required. Please fill in your name, email, and password.');
        return;
      }

      if (password.length < 8) {
        setError('Password must be at least 8 characters with uppercase, lowercase, and a number.');
        return;
      }

      await register(trimmedName, trimmedEmail, password, role);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Registration timed out. Please try again.');
        } else if (!err.response) {
          setError('Cannot reach the server. Please try again later.');
        } else {
          const details = err.response?.data?.details;
          if (Array.isArray(details) && details.length > 0) {
            setError(details.map((d: { message: string }) => d.message).join('. '));
          } else {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
          }
        }
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
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
      <div className="relative z-10 mx-auto mt-6 flex w-full max-w-xl items-start justify-center flex-1">
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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Start Your Journey</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">Set up your profile in under a minute</p>
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

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name */}
            <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp}>
              <label className="auth-label" htmlFor="register-name">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="register-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="auth-input"
                  autoComplete="name"
                />
              </div>
            </motion.div>

            {/* Email & Password row */}
            <div className="grid gap-5 md:grid-cols-2">
              <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp}>
                <label className="auth-label" htmlFor="register-email">Email Address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-email"
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

              <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp}>
                <label className="auth-label" htmlFor="register-password">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="auth-input"
                    autoComplete="new-password"
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
                {/* Password strength */}
                {password && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                    <div className="password-strength-track">
                      <div
                        className="password-strength-fill"
                        style={{ width: `${strength.score}%`, background: strength.color }}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Role selection */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="pt-1">
              <p className="auth-label">Account Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`role-card text-left ${role === 'student' ? 'active' : ''}`}
                >
                  <div className="role-check">
                    <Check className="h-3 w-3" />
                  </div>
                  <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Student</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Learn skills & get hired</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`role-card text-left ${role === 'company' ? 'active' : ''}`}
                >
                  <div className="role-check">
                    <Check className="h-3 w-3" />
                  </div>
                  <div className="mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-primary">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Company</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Find & hire top talent</p>
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Footer link */}
          <motion.p custom={6} initial="hidden" animate="visible" variants={fadeUp} className="mt-7 text-center text-sm text-slate-500 dark:text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="auth-link">
              Sign in
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
