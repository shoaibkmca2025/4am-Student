import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-6">
      <div className="max-w-xl w-full rounded-3xl border border-sky-100 bg-white/90 shadow-xl p-10 text-center">
        <p className="text-sm font-semibold tracking-widest text-sky-700 uppercase">404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-black text-slate-900">Page not found</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-sky-600 px-6 py-3 text-white font-semibold hover:bg-sky-700 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
