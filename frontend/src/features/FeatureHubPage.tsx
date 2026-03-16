import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Puzzle, Wrench } from 'lucide-react';

const cards = [
  {
    title: 'Feature Modules',
    desc: 'Gamified learning, study mirror, pomodoro rooms, distraction tracker, community, and marketplace.',
    to: '/modules',
    icon: Layers
  },
  {
    title: 'AI & Viral Tools',
    desc: 'Assignment generator, notes generator, presentation generator, panic tools, and productivity nudges.',
    to: '/tools',
    icon: Wrench
  },
  {
    title: 'Plug-and-Play APIs',
    desc: 'All new capabilities are exposed under /api/extensions without touching existing dashboard screens.',
    to: '/modules',
    icon: Puzzle
  }
];

const FeatureHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Student Platform Extensions</h1>
          <p className="text-slate-600">Optional modules that run alongside your existing dashboard and routes.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link key={card.title} to={card.to} className="rounded-2xl border border-sky-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
              <p className="text-sm text-slate-600 mt-2">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureHubPage;
