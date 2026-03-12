import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Award, Star, Flame, Trophy, Sparkles } from 'lucide-react';

interface GamificationProps {
  streak: number;
  xpGained: number;
  show: boolean;
  onHide: () => void;
}

const Gamification: React.FC<GamificationProps> = ({ streak, xpGained, show, onHide }) => {
  const [message, setMessage] = useState('');

  const getMessage = (streakCount: number) => {
    if (streakCount > 5) return "UNSTOPPABLE! 🔥";
    if (streakCount > 3) return "ON FIRE! 🚀";
    if (streakCount > 1) return "Keep it up! ✨";
    return "Great Start! 👍";
  };

  useEffect(() => {
    if (show) {
      setMessage(getMessage(streak));
      const timer = setTimeout(onHide, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, streak, onHide]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.8, rotate: 5 }}
          className="fixed bottom-24 right-8 z-50 pointer-events-none"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 blur-xl opacity-30 animate-pulse"></div>
            
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 p-4 pr-6 rounded-2xl shadow-2xl flex items-center gap-4 overflow-hidden">
              {/* Shine Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] animate-[shine_1s_infinite]" />

              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg">
                <Flame className={`w-6 h-6 ${streak > 3 ? 'animate-bounce' : ''}`} />
                {streak > 1 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900 shadow-sm">
                    {streak}x
                  </div>
                )}
              </div>
              
              <div>
                <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">
                  +{xpGained} XP
                </div>
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  {message}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Gamification;
