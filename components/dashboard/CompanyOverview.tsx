import React, { useState, useEffect } from 'react';
import { 
  Users, Briefcase, MessageSquare, TrendingUp, 
  ArrowRight, Clock, Target, CheckCircle, Search
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from './StatsCard';

interface OverviewProps {
  userName: string;
  setActiveTab: (tab: string) => void;
}

const CompanyOverview: React.FC<OverviewProps> = ({ userName, setActiveTab }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Dynamic Greeting Logic
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="saas-card relative overflow-hidden group"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{userName}</span>
            </h1>
            
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl font-medium">
              Ready to find your next top talent? You have 5 active job listings and 12 new applicants today.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
               <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Hiring Goal:</span>
                  <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "40%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-purple-400">40%</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
            <button 
              onClick={() => setActiveTab('post-job')}
              className="saas-button-primary flex items-center justify-center gap-2 group shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-500"
            >
              <Briefcase className="w-5 h-5" />
              <span>Post a Job</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setActiveTab('candidates')}
              className="saas-button-secondary flex items-center justify-center gap-2 backdrop-blur-sm bg-slate-800/30 hover:bg-slate-800/50"
            >
              <Search className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span>Search Candidates</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Active Jobs" 
          value="5" 
          icon={Briefcase} 
          trend="+2 this month" 
          trendUp={true} 
          color="primary" 
          progress={100}
          variant="circular"
          tooltip="Total active job postings."
        />
        <StatsCard 
          title="Total Applicants" 
          value="128" 
          icon={Users} 
          trend="+12 today" 
          trendUp={true} 
          color="secondary" 
          variant="chart"
          tooltip="Total candidates applied across all jobs."
        />
        <StatsCard 
          title="Interviews" 
          value="8" 
          icon={MessageSquare} 
          trend="3 Pending" 
          trendUp={true} 
          color="accent" 
          progress={65}
          variant="bar"
          tooltip="Scheduled interviews for this week."
        />
        <StatsCard 
          title="Offer Rate" 
          value="15%" 
          icon={Target} 
          trend="+2%" 
          trendUp={true} 
          color="purple" 
          variant="gauge"
          tooltip="Percentage of candidates receiving offers."
        />
      </div>

      {/* 3. Recent Activity / Candidates Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applicants */}
        <div className="saas-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Recent Applicants
            </h3>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                                {i === 1 ? 'JD' : i === 2 ? 'AS' : 'MR'}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200">Candidate Name {i}</h4>
                                <p className="text-xs text-slate-400">Applied for Senior React Dev</p>
                            </div>
                        </div>
                        <button className="text-xs font-medium text-purple-400 hover:text-purple-300">View Profile</button>
                    </div>
                ))}
            </div>
            <button 
                onClick={() => setActiveTab('candidates')}
                className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
            >
                View All Applicants
            </button>
        </div>

        {/* Upcoming Interviews */}
        <div className="saas-card p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Upcoming Interviews
            </h3>
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-amber-500/30 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200">Interview with Candidate {i}</h4>
                                <p className="text-xs text-slate-400">Today, {2 + i}:00 PM • Google Meet</p>
                            </div>
                        </div>
                        <button className="px-3 py-1 text-xs font-bold bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">Join</button>
                    </div>
                ))}
            </div>
             <button 
                onClick={() => setActiveTab('interviews')}
                className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
            >
                View Schedule
            </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
