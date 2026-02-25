import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Star, MapPin, DollarSign } from 'lucide-react';

const JobMatches: React.FC = () => {
  const jobs = [
    { 
      role: 'Junior Frontend Developer', 
      company: 'TechStart Inc.', 
      match: 95, 
      type: 'Remote', 
      salary: '$70k - $90k', 
      logo: 'T',
      color: 'bg-blue-500'
    },
    { 
      role: 'React Engineering Intern', 
      company: 'Creative Solutions', 
      match: 88, 
      type: 'Hybrid', 
      salary: '$25/hr - $35/hr', 
      logo: 'C',
      color: 'bg-purple-500'
    },
    { 
      role: 'Associate Software Engineer', 
      company: 'Global Systems', 
      match: 82, 
      type: 'New York, NY', 
      salary: '$85k - $100k', 
      logo: 'G',
      color: 'bg-emerald-500'
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="saas-card p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          Top Job Matches
        </h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
          View All
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {jobs.map((job, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ scale: 1.02 }}
            className="group relative p-4 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden"
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold text-white shadow-lg ${job.color}`}>
                  {job.logo}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">
                    {job.role}
                  </h4>
                  <p className="text-slate-400 text-xs font-medium">{job.company}</p>
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

            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium mt-3 pl-[52px]">
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
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-bold rounded-lg border border-slate-700 hover:border-indigo-500 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/20"
            >
              Apply Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default JobMatches;
