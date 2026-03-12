import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Star, MapPin, DollarSign } from 'lucide-react';

interface JobMatchesProps {
  jobs?: {
    id?: string;
    role: string;
    company: string;
    match: number;
    type: string;
    salary: string;
    logo: string;
    color: string;
    reasons: { positive: string[]; negative: string[] };
  }[];
  onApply?: (jobId: string) => void;
}

const JobMatches: React.FC<JobMatchesProps> = ({ jobs = [], onApply }) => {
  const hasJobs = jobs.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Top Job Matches
        </h3>
        {hasJobs && (
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
            View All
            </button>
        )}
      </div>

      {!hasJobs ? (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-8">
            <div className="w-16 h-16 bg-sky-100/50 rounded-full flex items-center justify-center mb-2 border border-sky-200">
                <Briefcase className="w-8 h-8 text-slate-500" />
            </div>
            <div>
                <h4 className="text-slate-800 font-bold text-sm">No Job Matches Yet</h4>
                <p className="text-slate-600 text-xs mt-1 max-w-[200px] mx-auto leading-relaxed">
                    Complete your profile skills and experience to unlock personalized job matches.
                </p>
            </div>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                Complete Profile
            </button>
        </div>
      ) : (
      <div className="space-y-3 flex-1">
        {jobs.map((job, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="group relative p-4 rounded-xl border border-sky-200 bg-white/50 hover:bg-sky-100 hover:border-sky-200 transition-all duration-300 overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-slate-900 shadow-lg ${job.color}`}>
                  {job.logo}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">
                    {job.role}
                  </h4>
                  <p className="text-slate-600 text-xs font-medium">{job.company}</p>
                </div>
              </div>
              
              <div className={`px-2 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                job.match >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                job.match >= 80 ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <Star className="w-3 h-3 fill-current" />
                {job.match}%
              </div>
            </div>

            {/* Match Reasons - Transparency */}
            <div className="pl-[52px] mb-3 space-y-1">
               {job.reasons.positive.slice(0, 2).map((reason, i) => (
                  <div key={`pos-${i}`} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                     <div className="w-3 h-3 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-2 h-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <span>{reason}</span>
                  </div>
               ))}
               {job.reasons.negative.slice(0, 1).map((reason, i) => (
                  <div key={`neg-${i}`} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                     <div className="w-3 h-3 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-2 h-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                     </div>
                     <span>Missing {reason}</span>
                  </div>
               ))}
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium pl-[52px] border-t border-sky-200/50 pt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.type}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {job.salary}
              </span>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => onApply && job.id && onApply(job.id)}
              className="mt-4 w-full py-2 bg-sky-100 hover:bg-indigo-600 text-slate-700 hover:text-primary text-xs font-bold rounded-lg border border-sky-200 hover:border-indigo-500 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
            >
              Apply Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ))}
      </div>
      )}
    </motion.div>
  );
};

export default JobMatches;


