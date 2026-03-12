import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, Lock, Mail, User } from 'lucide-react';
import axios from 'axios';

import { authService } from '../services/api';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'company'>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role
      };

      if (!payload.name || !payload.email || !payload.password) {
        setError('Name, email and password are required.');
        return;
      }

      const data = await authService.register(payload);
      if (!data?.token || !data?.user) {
        setError('Registration failed. Invalid server response.');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration failed', err);
      if (axios.isAxiosError(err) && err.code === 'ECONNABORTED') {
        setError('Registration timed out. Please try again.');
      } else if (axios.isAxiosError(err) && !err.response) {
        setError('Cannot reach backend on port 5000. Start backend and try again.');
      } else {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-secondary-300/35 blur-3xl" />
      </div>

      <button
        onClick={() => navigate('/')}
        className="relative z-10 inline-flex items-center gap-2 rounded-lg border border-slate-300/60 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition-colors hover:border-primary/40 hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </button>

      <div className="relative z-10 mx-auto mt-8 w-full max-w-xl">
        <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-[0_38px_80px_-46px_rgba(15,23,42,0.58)] backdrop-blur-xl md:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-lg font-black text-white shadow-lg shadow-primary/30">
              4
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-700">Start Your Journey</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Create Account</h1>
            <p className="mt-2 text-sm text-slate-500">Set up your profile in less than a minute.</p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-error-200 bg-error-50 px-4 py-3 text-sm font-medium text-error-700">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Full Name</span>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </label>

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
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </label>
            </div>

            <div className="pt-1">
              <p className="mb-2 text-sm font-semibold text-slate-700">Account Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    role === 'student'
                      ? 'border-primary-400 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <User className="mb-2 h-4 w-4" />
                  <p className="text-sm font-bold">Student</p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('company')}
                  className={`rounded-xl border px-4 py-3 text-left transition ${
                    role === 'company'
                      ? 'border-secondary-400 bg-secondary-50 text-secondary-700 shadow-sm'
                      : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <Briefcase className="mb-2 h-4 w-4" />
                  <p className="text-sm font-bold">Company</p>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:from-primary-600 hover:to-secondary-600 ${
                loading ? 'cursor-not-allowed opacity-70' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="font-bold text-primary-700 hover:text-primary-800">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
