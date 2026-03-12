import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { authService } from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email and password are required.');
        return;
      }

      const data = await authService.login({ email, password });

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);
      localStorage.setItem('userName', data.user.name);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || 'Login failed. Check credentials and backend status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-96 w-96 rounded-full bg-secondary-300/35 blur-3xl" />
      </div>

      <button
        onClick={() => navigate('/')}
        className="relative z-10 inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full rounded-3xl border border-slate-200/70 bg-white/88 p-8 shadow-[0_34px_75px_-45px_rgba(15,23,42,0.55)] backdrop-blur-xl md:p-10"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-lg font-black text-white shadow-lg shadow-primary/30">
              4
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Welcome Back</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Sign In</h1>
            <p className="mt-2 text-sm text-slate-500">Access your student or company dashboard.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm font-medium text-error-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:from-primary-600 hover:to-secondary-600 ${
                loading ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            New here?{' '}
            <button onClick={() => navigate('/register')} className="font-bold text-primary-700 hover:text-primary-800">
              Create account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
