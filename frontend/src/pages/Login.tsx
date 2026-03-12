import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Email and password are required.');
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

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 bg-slate-50 dark:bg-slate-900">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.4), transparent 70%)' }} />
        <div className="absolute -right-24 bottom-8 h-96 w-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)' }} />
      </div>

      <button
        onClick={() => navigate('/')}
        className="relative z-10 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors text-slate-600 dark:text-gray-400 border border-black/10 dark:border-primary/20 bg-white/50 dark:bg-slate-800/50 hover:border-primary/50 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full rounded-2xl p-8 backdrop-blur-xl md:p-10 bg-white/60 dark:bg-slate-800/60 border border-black/10 dark:border-primary/10 shadow-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white dark:text-black bg-primary">
              4
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Welcome Back</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Sign In</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">Access your student or company dashboard.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm font-medium" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-300">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="dark-input pl-10"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-300">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="dark-input pl-10"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary mt-2 w-full justify-center py-3 text-sm ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            New here?{' '}
            <button onClick={() => navigate('/register')} className="font-bold hover:underline" style={{ color: '#22d3ee' }}>
              Create account
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
