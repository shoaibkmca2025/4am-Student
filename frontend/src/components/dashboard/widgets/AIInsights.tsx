import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react';

type Insight = {
  text: string;
  type: 'positive' | 'action' | 'suggestion';
};

const iconByType: Record<Insight['type'], any> = {
  positive: CheckCircle,
  action: TrendingUp,
  suggestion: Lightbulb
};

const colorByType: Record<Insight['type'], string> = {
  positive: 'bg-success/10 text-success border-success/20',
  action: 'bg-primary/10 text-primary border-primary/20',
  suggestion: 'bg-warning/10 text-warning border-warning/20'
};

const AIInsights: React.FC<{ insights?: Insight[] }> = ({ insights = [] }) => {

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
         <Sparkles className="w-4 h-4 text-primary" />
         <h3 className="text-sm font-bold text-slate-600 dark:text-gray-400 uppercase tracking-wider">AI Insights</h3>
      </div>
      
      {insights.length === 0 ? (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-6 text-center">
            <div className="w-10 h-10 bg-sky-100/50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-3 border border-sky-200 dark:border-white/10">
                <Lightbulb className="w-5 h-5 text-slate-500 dark:text-gray-400" />
            </div>
            <h4 className="text-slate-700 dark:text-gray-300 font-bold text-xs mb-1">No Insights Yet</h4>
            <p className="text-slate-500 dark:text-gray-500 text-[10px]">Complete more activities to generate AI insights.</p>
        </div>
      ) : (
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x">
        {insights.map((insight, idx) => {
          const Icon = iconByType[insight.type] || Lightbulb;
          const chipColor = colorByType[insight.type] || colorByType.suggestion;
          return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="flex-shrink-0 w-72 saas-card p-4 hover:border-sky-300 transition-all snap-start group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
                insight.type === 'positive' ? 'bg-success' : 
                insight.type === 'action' ? 'bg-primary' : 'bg-warning'
            }`}></div>
            
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg border ${chipColor}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-slate-700 dark:text-gray-300 font-medium leading-snug group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                  {insight.text}
                </p>
                <button className="text-[10px] font-bold text-slate-500 mt-2 hover:text-primary transition-colors uppercase tracking-wide flex items-center gap-1">
                    View Details <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        );
        })}
        
        {/* View All Card */}
        <motion.div 
            className="flex-shrink-0 w-32 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-4 hover:bg-sky-100/80 dark:hover:bg-slate-700/80 transition-colors cursor-pointer snap-start group"
            whileHover={{ scale: 1.05 }}
        >
            <div className="p-3 bg-sky-100 dark:bg-slate-700 rounded-full mb-2 group-hover:bg-sky-200 dark:group-hover:bg-slate-600 transition-colors">
                <ArrowUpRight className="w-5 h-5 text-slate-700 dark:text-gray-300 group-hover:text-primary" />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-gray-400 group-hover:text-primary transition-colors">View All</span>
        </motion.div>
      </div>
      )}
    </div>
  );
};

export default AIInsights;


