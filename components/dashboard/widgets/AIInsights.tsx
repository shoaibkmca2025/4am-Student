import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, ArrowUpRight, TrendingUp, CheckCircle } from 'lucide-react';

const AIInsights: React.FC = () => {
  const insights = [
    { text: "Your readiness improved 18% due to mock interviews.", type: "positive", icon: TrendingUp },
    { text: "Improve React to unlock 23% more job matches.", type: "action", icon: ArrowUpRight },
    { text: "Your resume is in the top 10% for layout.", type: "positive", icon: CheckCircle },
    { text: "Add 'TypeScript' to your skills to boost visibility.", type: "suggestion", icon: Lightbulb },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3 px-1">
         <Sparkles className="w-4 h-4 text-primary" />
         <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">AI Insights</h3>
      </div>
      
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="flex-shrink-0 w-72 saas-card p-4 hover:border-slate-600 transition-all snap-start group relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
                insight.type === 'positive' ? 'bg-success' : 
                insight.type === 'action' ? 'bg-primary' : 'bg-warning'
            }`}></div>
            
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg border ${
                insight.type === 'positive' ? 'bg-success/10 text-success border-success/20' : 
                insight.type === 'action' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-warning/10 text-warning border-warning/20'
              }`}>
                <insight.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm text-slate-300 font-medium leading-snug group-hover:text-slate-200 transition-colors">
                  {insight.text}
                </p>
                <button className="text-[10px] font-bold text-slate-500 mt-2 hover:text-primary transition-colors uppercase tracking-wide flex items-center gap-1">
                    View Details <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* View All Card */}
        <motion.div 
            className="flex-shrink-0 w-32 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-4 hover:bg-slate-800/80 transition-colors cursor-pointer snap-start group"
            whileHover={{ scale: 1.05 }}
        >
            <div className="p-3 bg-slate-800 rounded-full mb-2 group-hover:bg-slate-700 transition-colors">
                <ArrowUpRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
            </div>
            <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">View All</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AIInsights;
