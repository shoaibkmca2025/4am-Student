import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Puzzle, Wrench, ArrowLeft, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const cards = [
  {
    title: 'Feature Modules',
    desc: 'Gamified learning, study mirror, pomodoro rooms, distraction tracker, community, and marketplace.',
    to: '/modules',
    icon: Layers,
    gradient: 'from-indigo-500 to-blue-500',
    glow: 'indigo',
  },
  {
    title: 'AI & Viral Tools',
    desc: 'Assignment generator, notes generator, presentation generator, panic tools, and productivity nudges.',
    to: '/tools',
    icon: Wrench,
    gradient: 'from-cyan-500 to-teal-500',
    glow: 'cyan',
  },
  {
    title: 'Plug-and-Play APIs',
    desc: 'All new capabilities are exposed under /api/extensions without touching existing dashboard screens.',
    to: '/modules',
    icon: Puzzle,
    gradient: 'from-purple-500 to-pink-500',
    glow: 'purple',
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const FeatureHubPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Header */}
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Student Platform Extensions</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">Optional modules that run alongside your existing dashboard.</p>
          </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-8 md:p-10 mb-10 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23fff%22%20fill-opacity%3D%220.04%22%3E%3Cpath%20d%3D%22M0%200h20v20H0zM20%2020h20v20H20z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />   
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Supercharge Your Learning</h2>
              <p className="text-white/70 text-sm mt-1 max-w-xl">Explore AI-powered tools, gamified study rooms, and community features designed to accelerate your growth.</p>
            </div>
          </div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Link
                to={card.to}
                className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/60 border border-black/5 dark:border-white/5 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Glow Effect on Hover */}
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{card.title}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">{card.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureHubPage;
