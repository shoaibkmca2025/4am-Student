import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Info } from 'lucide-react';

const ActivityHeatmap: React.FC = () => {
  const weeks = 52;
  const days = 7;
  
  // Generate realistic-looking activity data
  // Simulating a student who studies mostly on weekdays and some weekends
  const getIntensity = (weekIndex: number, dayIndex: number) => {
    // Weekdays (1-5) have higher chance of activity
    // Weekends (0, 6) have lower chance
    
    const isWeekend = dayIndex === 0 || dayIndex === 6;
    const baseChance = isWeekend ? 0.4 : 0.8;
    
    // Add some "streaks" or "exam periods" where activity is higher
    const isExamPeriod = (weekIndex > 10 && weekIndex < 14) || (weekIndex > 30 && weekIndex < 34);
    const chance = isExamPeriod ? baseChance + 0.2 : baseChance;
    
    const rand = Math.random();
    
    if (rand < chance * 0.3) return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'; // High (Deep Focus)
    if (rand < chance * 0.6) return 'bg-emerald-500/70'; // Medium (Regular Study)
    if (rand < chance * 0.9) return 'bg-emerald-500/30'; // Low (Quick Review)
    return 'bg-slate-800/50'; // None
  };

  const heatmapData = Array.from({ length: weeks * days }).map((_, i) => {
    const weekIndex = Math.floor(i / days);
    const dayIndex = i % days;
    return getIntensity(weekIndex, dayIndex);
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="saas-card p-6 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          Learning Activity
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-slate-800/50 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-500/30 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-500/70 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm shadow-[0_0_4px_rgba(16,185,129,0.4)]"></div>
          <span>More</span>
        </div>
      </div>

      <div className="relative">
        {/* Days of week labels */}
        <div className="absolute -left-6 top-0 flex flex-col justify-between h-full py-1 text-[10px] text-slate-500 font-medium">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide ml-2 mask-linear-fade">
          {Array.from({ length: weeks }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: days }).map((_, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (weekIndex * 0.01) + (dayIndex * 0.005) }}
                  className={`w-2.5 h-2.5 rounded-[2px] ${heatmapData[weekIndex * 7 + dayIndex]} transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                  title={`Activity on Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-5 flex items-center justify-between text-sm border-t border-slate-800 pt-4">
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Contributions</span>
            <span className="text-slate-200 font-bold text-lg">1,248</span>
        </div>
        
        <div className="h-8 w-px bg-slate-800"></div>

        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Streak</span>
            <span className="text-emerald-400 font-bold text-lg flex items-center gap-1">
                <Flame className="w-4 h-4 fill-emerald-400/20" /> 12 Days
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;
