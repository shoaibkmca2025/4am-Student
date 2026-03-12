import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Info } from 'lucide-react';

interface ActivityHeatmapProps {
  activityData?: number[]; // Array of intensity 0-4
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ activityData = [] }) => {
  const weeks = 52;
  const days = 7;
  
  // If no data, fill with zeros
  const heatmapData = activityData.length === weeks * days 
    ? activityData 
    : Array(weeks * days).fill(0);

  const getIntensityClass = (value: number) => {
    switch(value) {
      case 4: return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 3: return 'bg-emerald-500/70';
      case 2: return 'bg-emerald-500/30';
      case 1: return 'bg-emerald-900/50';
      default: return 'bg-sky-100/50';
    }
  };

  const totalContributions = heatmapData.reduce((acc, curr) => acc + (curr > 0 ? 1 : 0), 0);
  
  // Calculate current streak
  let currentStreak = 0;
  // This is a simplified streak calc, assuming data is ordered chronologically ending today
  // In a real app, you'd check dates
  for (let i = heatmapData.length - 1; i >= 0; i--) {
    if (heatmapData[i] > 0) currentStreak++;
    else break;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Flame className="w-5 h-5 text-emerald-400" />
          Learning Activity
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-sky-100/50 px-3 py-1.5 rounded-full border border-sky-200/50">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-sky-100/50 rounded-sm"></div>
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
                  className={`w-2.5 h-2.5 rounded-[2px] ${getIntensityClass(heatmapData[weekIndex * 7 + dayIndex])} transition-all hover:scale-125 hover:z-10 cursor-pointer`}
                  title={`Activity on Week ${weekIndex + 1}, Day ${dayIndex + 1}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-5 flex items-center justify-between text-sm border-t border-sky-200 pt-4">
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Contributions</span>
            <span className="text-slate-800 font-bold text-lg">{totalContributions}</span>
        </div>
        
        <div className="h-8 w-px bg-sky-100"></div>

        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Streak</span>
            <span className="text-emerald-400 font-bold text-lg flex items-center gap-1">
                <Flame className="w-4 h-4 fill-emerald-400/20" /> {currentStreak} Days
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ActivityHeatmap;

