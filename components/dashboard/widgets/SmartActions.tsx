import React from 'react';
import { motion } from 'framer-motion';
import { Zap, FileText, Layout, ArrowRight, Star, Target, TrendingUp, Sparkles, Lock } from 'lucide-react';

interface SmartActionsProps {
  setActiveTab: (tab: string) => void;
}

const SmartActions: React.FC<SmartActionsProps> = ({ setActiveTab }) => {
  const actions = [
    { 
      id: 'resume-1',
      title: 'Optimize Your Resume', 
      description: 'Your profile strength is at 65%. Add 2 more projects to reach the top 10% of candidates.',
      impact: 'High Impact',
      xp: '+150 XP',
      icon: FileText, 
      theme: 'blue',
      targetTab: 'resume',
      isPremium: true
    },
    { 
      id: 'skill-1',
      title: 'Master System Design', 
      description: 'Based on your recent React scores, this is your best next step to unlock Senior roles.',
      impact: 'Career Unlock',
      xp: '+500 XP',
      icon: Layout, 
      theme: 'purple',
      targetTab: 'interview',
      isPremium: false
    },
    { 
      id: 'quiz-1',
      title: 'React Advanced Hooks', 
      description: 'Quick 5-min quiz to keep your streak alive and earn a badge.',
      impact: 'Daily Goal',
      xp: '+50 XP',
      icon: Zap, 
      theme: 'amber',
      targetTab: 'skills',
      isPremium: false
    },
  ];

  const getThemeStyles = (theme: string, isPremium: boolean) => {
    switch (theme) {
      case 'blue': return {
        bg: 'from-blue-500/10 to-indigo-500/10',
        border: 'border-blue-500/30',
        icon: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
      };
      case 'purple': return {
        bg: 'from-purple-500/10 to-pink-500/10',
        border: 'border-purple-500/30',
        icon: 'text-purple-400',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        glow: 'group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
      };
      case 'amber': return {
        bg: 'from-amber-500/10 to-orange-500/10',
        border: 'border-amber-500/30',
        icon: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]'
      };
      default: return {
        bg: 'from-slate-700/50 to-slate-800/50',
        border: 'border-slate-600',
        icon: 'text-slate-400',
        badge: 'bg-slate-700 text-slate-300',
        glow: ''
      };
    }
  };

  const hasActions = actions.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-slate-100">Your Next Best Steps</h3>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full border border-slate-700 animate-pulse">
          AI Generated
        </span>
      </div>
      
      {!hasActions ? (
        <div className="flex flex-col items-center justify-center p-8 border border-slate-800 rounded-xl bg-slate-900/40 text-center">
            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-slate-500" />
            </div>
            <h4 className="text-slate-200 font-bold text-sm">All caught up!</h4>
            <p className="text-slate-400 text-xs mt-1 max-w-[200px]">
                You've completed all recommended actions for now. Great work!
            </p>
            <button 
                onClick={() => setActiveTab('jobs')}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors border border-slate-700"
            >
                Browse Jobs
            </button>
        </div>
      ) : (
      <div className="grid gap-3">
        {actions.map((action, idx) => {
          const styles = getThemeStyles(action.theme, action.isPremium);
          const isTopPriority = idx === 0;
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveTab(action.targetTab)}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.99 }}
              className={`
                relative w-full text-left p-4 rounded-xl border transition-all duration-300 group overflow-hidden backdrop-blur-xl
                bg-gradient-to-br ${styles.bg} ${styles.border} ${styles.glow}
                ${isTopPriority ? 'ring-2 ring-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'hover:border-opacity-100 border-opacity-60'}
              `}
            >
              {/* Top Priority Label */}
              {isTopPriority && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg z-20">
                  TOP PRIORITY
                </div>
              )}

              {/* Shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />

              <div className="flex items-start gap-4 relative z-10">
                <div className={`p-3 rounded-lg bg-slate-900/50 backdrop-blur-sm border border-white/10 ${styles.icon}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {action.title}
                    </h4>
                    {!isTopPriority && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles.badge}`}>
                        {action.impact}
                        </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-slate-400 leading-relaxed pr-8">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      <Zap className="w-3 h-3" />
                      {action.xp}
                    </span>
                    {action.isPremium && (
                      <span className="flex items-center gap-1 text-xs font-medium text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">
                        <Star className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>

                <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <div className="bg-slate-800/80 p-2 rounded-full border border-slate-700 text-white shadow-lg backdrop-blur-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
      )}
      
      {hasActions && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 mt-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-900/40 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 group"
      >
        <Target className="w-4 h-4 group-hover:text-primary transition-colors" />
        View All Recommendations
      </motion.button>
      )}
    </div>
  );
};

export default SmartActions;
