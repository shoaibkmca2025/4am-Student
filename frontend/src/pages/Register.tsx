import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Lock, Mail, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

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
        setError('Name, email and password are required.');
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
    <div className="relative min-h-screen overflow-hidden px-4 py-10 bg-slate-50 dark:bg-[#030303]">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(0,245,255,0.4), transparent 70%)' }} />
        <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)' }} />
      </div>

      <button
        onClick={() => navigate('/')}
        className="relative z-10 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-colors text-slate-600 dark:text-gray-400 border border-black/10 dark:border-primary/20 bg-white/50 dark:bg-black/50 hover:border-primary/50 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="relative z-10 mx-auto mt-8 w-full max-w-xl">
        <div
          className="rounded-2xl p-8 backdrop-blur-xl md:p-10 bg-white/60 dark:bg-black/60 border border-black/10 dark:border-primary/10 shadow-2xl"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-lg font-black text-white dark:text-black bg-primary">
              4
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Start Your Journey</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">Set up your profile in less than a minute.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl px-4 py-3 text-sm font-medium" style={{ border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-gray-300">Full Name</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="dark-input pl-10"
                  />
                </div>
              </label>

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
                    placeholder="Min 8 chars, upper, lower, number"
                    className="dark-input pl-10"
                  />
                </div>
              </label>
            </div>

            <div className="pt-1">
              <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-gray-300">Account Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-xl px-4 py-3 text-left transition ${role === 'student' ? 'border-primary bg-primary/10 text-primary' : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-slate-600 dark:text-gray-400 border'}`}
                >
                  <User className="mb-2 h-4 w-4" />
                  <p className="text-sm font-bold">Student</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`rounded-xl px-4 py-3 text-left transition ${role === 'company' ? 'border-primary bg-primary/10 text-primary' : 'border-black/10 dark:border-white/10 bg-white/50 dark:bg-black/50 text-slate-600 dark:text-gray-400 border'}`}
                >
                  <Briefcase className="mb-2 h-4 w-4" />
                  <p className="text-sm font-bold">Company</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn-primary mt-2 w-full justify-center py-3 text-sm ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="font-bold hover:underline" style={{ color: '#00f5ff' }}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
