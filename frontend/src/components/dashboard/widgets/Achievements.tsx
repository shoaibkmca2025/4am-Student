import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Zap, Trophy, Crown, X, Lock, Flame } from 'lucide-react';
import { achievementService } from '../../../services/api';

const Confetti = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex justify-center overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            y: 800,
            x: (Math.random() - 0.5) * 600,
            rotate: Math.random() * 720
          }}
          transition={{ duration: 2 + Math.random() * 3, ease: "easeOut" }}
          className="absolute top-0 w-3 h-3 rounded-sm"
          style={{
            backgroundColor: ['#FBBF24', '#F472B6', '#60A5FA', '#34D399'][Math.floor(Math.random() * 4)],
            left: `${50 + (Math.random() - 0.5) * 10}%`
          }}
        />
      ))}
    </div>
  );
};

const Achievements: React.FC<{ streak?: number }> = ({ streak: streakProp = 0 }) => {
  const [showAll, setShowAll] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const visibleBadges = showAll ? badges : badges.slice(0, 4);

  if (loading) {
    return (
      <div className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {showConfetti && <Confetti />}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col relative z-0"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Gamification
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md" title="Current Streak">
              <Flame className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 fill-orange-500/20" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{streakProp} {streakProp === 1 ? 'Day' : 'Days'}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md cursor-pointer hover:bg-amber-500/20 transition-colors" onClick={triggerConfetti}>
              <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Level {level}</span>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs text-slate-600 font-medium uppercase tracking-wider">Current XP</span>
            <span className="text-sm text-slate-800 font-bold">{xp} <span className="text-slate-500">/ {maxXp}</span></span>
          </div>
          <div className="h-2 w-full bg-sky-100 rounded-full overflow-hidden relative group cursor-pointer" onClick={triggerConfetti}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(xp / maxXp) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_15px_rgba(99,102,241,0.8)] transition-shadow"
            />
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-500 mt-2 text-right">{maxXp - xp} XP to Level {level + 1}</p>
        </div>

        {/* Badges Grid */}
        <div className="flex-1">
          <h4 className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">Recent Badges</h4>
          <div className="grid grid-cols-4 gap-3">
            {visibleBadges.slice(0, 4).map((badge, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 text-center gap-1 border transition-all cursor-pointer relative group ${badge.unlocked
                    ? badge.color
                    : 'bg-sky-100/50 border-sky-200 text-slate-600 grayscale opacity-50'
                  }`}
              >
                <span className="text-xl drop-shadow-lg">{badge.icon}</span>
                {badge.unlocked && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-sky-200 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                )}

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-white text-xs text-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl border border-sky-200">
                  <p className="font-bold text-slate-900 mb-0.5">{badge.title}</p>
                  <p className="text-[10px] text-slate-600">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAll(true)}
          className="mt-6 w-full saas-button-secondary flex items-center justify-center gap-2 hover:bg-sky-100 hover:text-primary transition-colors"
        >
          View All Achievements <Award className="w-3 h-3" />
        </motion.button>
      </motion.div>

      {/* Full Achievements Modal */}
      <AnimatePresence>
        {showAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-50/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-sky-200 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-sky-200 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    All Achievements
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    You've unlocked <span className="text-emerald-600 dark:text-emerald-400 font-bold">{badges.filter(b => b.unlocked).length}</span> out of {badges.length} badges
                  </p>
                </div>
                <button
                  onClick={() => setShowAll(false)}
                  className="p-2 hover:bg-sky-100 rounded-full text-slate-600 hover:text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {badges.map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center p-4 text-center gap-2 border transition-all relative group ${badge.unlocked
                        ? `${badge.color} hover:scale-105 shadow-lg`
                        : 'bg-sky-100/30 border-sky-200 text-slate-600 grayscale'
                      }`}
                  >
                    <span className="text-3xl drop-shadow-md mb-1">{badge.icon}</span>
                    <h4 className={`text-sm font-bold ${badge.unlocked ? 'text-slate-900' : 'text-slate-500'}`}>
                      {badge.title}
                    </h4>

                    {!badge.unlocked && (
                      <div className="absolute top-2 right-2 text-slate-600">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}

                    {/* Hover Info */}
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                      <div>
                        <p className="text-xs font-bold text-slate-900 mb-1">{badge.title}</p>
                        <p className="text-[10px] text-slate-600 leading-tight">{badge.desc}</p>
                        <div className={`mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${badge.unlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-200 text-slate-600'
                          }`}>
                          {badge.unlocked ? 'Unlocked' : 'Locked'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Achievements;


