import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Lock, Zap } from 'lucide-react';
import { achievementService } from '../../services/api';

const Achievements: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [maxXp, setMaxXp] = useState(1000);
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const data = await achievementService.get();
        if (data) {
          setLevel(data.level);
          setXp(data.xp);
          setMaxXp(data.maxXp);
          setBadges(data.badges);
        }
      } catch (error) {
        console.error('Failed to fetch achievements', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Achievements & Badges
          </h1>
          <p className="text-slate-600 mt-2">
            Track your progress and earn rewards as you learn. You've unlocked <span className="text-emerald-400 font-bold">{badges.filter(b => b.unlocked).length}</span> out of {badges.length} badges.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-sky-100/50 p-4 rounded-xl border border-sky-200/50">
          <div className="text-center px-4 border-r border-sky-200">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Level</p>
            <p className="text-2xl font-bold text-amber-400 flex items-center justify-center gap-1">
              <Crown className="w-5 h-5" /> {level}
            </p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-slate-600 uppercase tracking-wider font-semibold">Total XP</p>
            <p className="text-2xl font-bold text-indigo-400 flex items-center justify-center gap-1">
              <Zap className="w-5 h-5" /> {xp}
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
          <span className="text-sm font-semibold text-slate-700">Level Progress</span>
          <span className="text-sm font-bold text-slate-800">{xp} / {maxXp} XP</span>
        </div>
        <div className="h-4 w-full bg-sky-100 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(xp / maxXp) * 100}%` }}
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
        <p className="text-xs text-slate-500 mt-2 text-right">{maxXp - xp} XP needed for Level {level + 1}</p>
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
                : 'bg-sky-100/30 border-sky-200 text-slate-600 grayscale'
            }`}
          >
            <div className="relative">
              <span className="text-4xl drop-shadow-md">{badge.icon}</span>
              {badge.unlocked && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-sky-200 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                />
              )}
            </div>
            
            <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
              {badge.title}
            </h4>
            
            {!badge.unlocked && (
              <div className="absolute top-3 right-3 text-slate-600">
                <Lock className="w-4 h-4" />
              </div>
            )}

            {/* Hover Info */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10 border border-sky-200">
              <div>
                <p className="text-xs font-bold text-slate-900 mb-2">{badge.title}</p>
                <p className="text-[11px] text-slate-600 leading-tight mb-3">{badge.desc}</p>
                <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full inline-block ${
                  badge.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-200 text-slate-600'
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


