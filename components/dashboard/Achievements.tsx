import React from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Crown, Lock, Zap } from 'lucide-react';

const Achievements: React.FC = () => {
  const badges = [
    { title: 'Resume Pro', icon: '📄', unlocked: true, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', desc: 'Created a perfect resume' },
    { title: 'Interview Ace', icon: '🎤', unlocked: true, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', desc: 'Completed 5 mock interviews' },
    { title: 'Code Warrior', icon: '🐍', unlocked: false, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', desc: 'Solved 50 coding problems' },
    { title: 'Streak Master', icon: '🔥', unlocked: false, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', desc: 'Maintained a 30-day streak' },
    { title: 'Bug Hunter', icon: '🐛', unlocked: false, color: 'text-red-400 bg-red-500/10 border-red-500/20', desc: 'Found and fixed 10 bugs' },
    { title: 'Team Player', icon: '🤝', unlocked: true, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', desc: 'Collaborated on 3 projects' },
    { title: 'Fast Learner', icon: '⚡', unlocked: true, color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', desc: 'Completed a course in 1 week' },
    { title: 'Top 1%', icon: '🏆', unlocked: false, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', desc: 'Reached top 1% of students' },
    { title: 'Early Bird', icon: '🌅', unlocked: true, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', desc: 'Completed a task before 8 AM' },
    { title: 'Night Owl', icon: '🦉', unlocked: false, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', desc: 'Studied after midnight' },
    { title: 'Mentor', icon: '🎓', unlocked: false, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', desc: 'Helped 5 other students' },
    { title: 'Blogger', icon: '✍️', unlocked: true, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', desc: 'Wrote a technical article' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Achievements & Badges
          </h1>
          <p className="text-slate-400 mt-2">
            Track your progress and earn rewards as you learn. You've unlocked <span className="text-emerald-400 font-bold">{badges.filter(b => b.unlocked).length}</span> out of {badges.length} badges.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-center px-4 border-r border-slate-700">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Level</p>
            <p className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Crown className="w-5 h-5" /> 5
            </p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total XP</p>
            <p className="text-2xl font-bold text-indigo-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5" /> 1,250
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="saas-card p-6"
      >
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-slate-300">Level Progress</span>
          <span className="text-sm font-bold text-slate-200">1,250 / 2,000 XP</span>
        </div>
        <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '62.5%' }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          />
          {/* Milestones */}
          <div className="absolute top-0 left-0 w-full h-full flex justify-between px-2">
            <div className="w-px h-full bg-white/10"></div>
            <div className="w-px h-full bg-white/10"></div>
            <div className="w-px h-full bg-white/10"></div>
            <div className="w-px h-full bg-white/10"></div>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right">750 XP needed for Level 6</p>
      </motion.div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {badges.map((badge, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 + 0.2 }}
            className={`aspect-square rounded-xl flex flex-col items-center justify-center p-4 text-center gap-3 border transition-all relative group ${
              badge.unlocked 
                ? `${badge.color} hover:scale-105 shadow-lg`
                : 'bg-slate-800/30 border-slate-800 text-slate-600 grayscale'
            }`}
          >
            <div className="relative">
              <span className="text-4xl drop-shadow-md">{badge.icon}</span>
              {badge.unlocked && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                />
              )}
            </div>
            
            <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>
              {badge.title}
            </h4>
            
            {!badge.unlocked && (
              <div className="absolute top-3 right-3 text-slate-600">
                <Lock className="w-4 h-4" />
              </div>
            )}

            {/* Hover Info */}
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10 border border-slate-700">
              <div>
                <p className="text-xs font-bold text-white mb-2">{badge.title}</p>
                <p className="text-[11px] text-slate-400 leading-tight mb-3">{badge.desc}</p>
                <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full inline-block ${
                  badge.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
