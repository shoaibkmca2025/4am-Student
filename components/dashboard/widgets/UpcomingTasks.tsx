import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Code, Users } from 'lucide-react';

const UpcomingTasks: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Upcoming Schedule
        </h3>
        <button className="text-xs text-slate-400 hover:text-slate-200 transition-colors">View Calendar</button>
      </div>

      <div className="space-y-3 flex-1">
        {/* Task 1: Interview */}
        <div className="group flex items-start gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-orange-500/30 transition-all cursor-pointer">
          <div className="p-2.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all">
            <Video className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-200 text-sm group-hover:text-orange-400 transition-colors truncate">TechStart Interview</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">Today</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <Clock className="w-3 h-3" /> 2:00 PM - 3:00 PM
            </p>
          </div>
        </div>

        {/* Task 2: Coding Practice */}
        <div className="group flex items-start gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/30 transition-all cursor-pointer">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
            <Code className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors truncate">LeetCode Contest</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">Tomorrow</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <Clock className="w-3 h-3" /> 10:00 AM - 11:30 AM
            </p>
          </div>
        </div>

        {/* Task 3: Project Meeting */}
        <div className="group flex items-start gap-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/30 transition-all cursor-pointer">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
            <Users className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-slate-200 text-sm group-hover:text-emerald-400 transition-colors truncate">Capstone Sync</h4>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">Mon</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <Clock className="w-3 h-3" /> 4:30 PM - 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingTasks;
