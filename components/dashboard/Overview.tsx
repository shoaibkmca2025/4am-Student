import React, { useState, useEffect } from 'react';
import { 
  Briefcase, FileText, Code, MessageSquare, TrendingUp, 
  ArrowRight, Star, Clock, MapPin, Zap, BookOpen, Crown, Video,
  CheckCircle, Target, Sparkles, Trophy, Flame, X, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from './StatsCard';
import TiltCard from './TiltCard';
import SkillRadar from './widgets/SkillRadar';
import ActivityHeatmap from './widgets/ActivityHeatmap';
import JobMatches from './widgets/JobMatches';
import AIInsights from './widgets/AIInsights';
import SmartActions from './widgets/SmartActions';
import InteractiveAnalytics from './widgets/InteractiveAnalytics';
import Achievements from './widgets/Achievements';
import UpcomingTasks from './widgets/UpcomingTasks';

interface OverviewProps {
  userName: string;
  setActiveTab: (tab: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ userName, setActiveTab }) => {
  const [skillPoints, setSkillPoints] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [motivation, setMotivation] = useState('');
  const [showGoals, setShowGoals] = useState(false);

  const goals = [
    { id: 1, title: 'Complete React Advanced Course', category: 'Learning', progress: 75, target: '100%', date: '2 days left' },
    { id: 2, title: 'Apply to 10 Senior Roles', category: 'Career', progress: 40, target: '10 jobs', date: '1 week left' },
    { id: 3, title: 'Solve 50 LeetCode Problems', category: 'Practice', progress: 60, target: '50 probs', date: '2 weeks left' },
    { id: 4, title: 'Update Portfolio Website', category: 'Personal', progress: 90, target: '100%', date: '3 days left' },
  ];

  useEffect(() => {
    const savedAssessments = JSON.parse(localStorage.getItem('user_assessments') || '{}');
    const points = Object.values(savedAssessments).filter((a: any) => a.status === 'Completed').length * 100;
    setSkillPoints(50 + points);

    // Dynamic Greeting Logic
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Random Motivation
    const quotes = [
      "You're improving fast! Keep pushing.",
      "Small steps every day lead to big results.",
      "Your resume is looking sharper than ever.",
      "Focus on the process, and the results will follow.",
      "You're in the top 15% of active learners this week!"
    ];
    setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Welcome Banner - Premium Redesign */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl relative overflow-hidden group"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        
        <div className="relative z-10 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                Premium Member
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Top 10%
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{userName}</span>
            </h1>
            
            <p className="text-slate-300 text-sm leading-relaxed max-w-xl font-medium">
              {motivation}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
               <div className="flex items-center gap-2 bg-slate-800/50 p-1 pr-2.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
                  <div className="p-1 bg-amber-500/20 rounded-full text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Streak</p>
                    <p className="text-[11px] font-bold text-white">5 Days</p>
                  </div>
               </div>
               
               <div className="h-5 w-px bg-slate-700/50 hidden sm:block"></div>
               
               <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-[11px]">Next Level:</span>
                  <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-400">75%</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 min-w-[180px]">
            <button 
              onClick={() => setActiveTab('skills')}
              className="bg-indigo-600/80 backdrop-blur-md hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/30 flex items-center justify-center gap-2 group text-sm"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Learning</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowGoals(true)}
              className="saas-button-secondary flex items-center justify-center gap-2 backdrop-blur-sm bg-slate-800/30 hover:bg-slate-800/50 py-2 px-4 text-sm"
            >
              <Target className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span>View Goals</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Metrics Row (Advanced Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Career Readiness Breakdown - Spans 2 Columns */}
        <TiltCard 
          className="col-span-1 md:col-span-2 lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
           {/* Background effects */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -mr-10 -mt-10 opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{ transform: 'translateZ(-20px)' }}></div>

           <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform duration-300">
                       <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                       <h3 className="text-base font-bold text-slate-200 group-hover:text-white transition-colors">Career Readiness</h3>
                       <p className="text-[10px] text-slate-400">AI-Calculated Probability</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-lg text-[10px] font-medium group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% this week</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                 {/* Main Circular Score */}
                 <div className="relative w-24 h-24 flex-shrink-0 group-hover:scale-110 transition-transform duration-500" style={{ transform: 'translateZ(30px)' }}>
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="251" strokeDashoffset={251 - (251 * 0.78)} strokeLinecap="round" className="text-indigo-500 transition-all duration-1000 ease-out" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">78%</span>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Ready</span>
                     </div>
                 </div>

                 {/* Breakdown Metrics */}
                 <div className="flex-1 w-full space-y-2">
                    {[
                       { label: 'Resume Quality', value: 85, color: 'bg-emerald-500', icon: FileText, tip: 'Strong action verbs used.' },
                       { label: 'Skills Match', value: 72, color: 'bg-blue-500', icon: Code, tip: 'Missing TypeScript.' },
                       { label: 'Interview Readiness', value: 65, color: 'bg-purple-500', icon: MessageSquare, tip: 'Practice behavioral Qs.' },
                    ].map((metric, idx) => (
                       <div key={idx} className="group/metric relative cursor-help">
                          <div className="flex justify-between text-[10px] mb-1">
                             <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                                <metric.icon className="w-3 h-3 text-slate-500" /> {metric.label}
                             </span>
                             <span className="text-slate-200 font-bold">{metric.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                                className={`h-full ${metric.color}`}
                             />
                          </div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[150px] p-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-lg text-[10px] text-slate-300 opacity-0 invisible group-hover/metric:opacity-100 group-hover/metric:visible transition-all duration-200 z-50 pointer-events-none shadow-xl">
                             {metric.tip}
                             <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-slate-900/95 transform rotate-45 border-r border-b border-slate-700/50"></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* AI Insight Footer */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-start gap-2 bg-gradient-to-r from-amber-500/5 to-transparent -mx-5 -mb-5 p-3">
                 <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                 <p className="text-xs text-slate-300 leading-snug">
                    <span className="text-amber-400 font-bold">AI Insight:</span> You are <span className="text-white font-bold underline decoration-indigo-500/50 underline-offset-2">2 skills away</span> (TypeScript, Testing) from increasing your readiness to 85%.
                 </p>
              </div>
           </div>
        </TiltCard>

        <StatsCard 
          title="Applications" 
          value="12" 
          icon={Briefcase} 
          trend="2 Pending" 
          trendUp={true} 
          color="secondary" 
          variant="chart"
          tooltip="Total job applications sent this month."
        />
        <StatsCard 
          title="Skill Points" 
          value={skillPoints.toString()} 
          icon={Code} 
          trend="Lvl 5" 
          trendUp={true} 
          color="accent" 
          progress={65}
          variant="bar"
          tooltip="XP earned from completing assessments and challenges."
        />
        <StatsCard 
          title="Interview Conf." 
          value="4.5/5" 
          icon={MessageSquare} 
          trend="+0.5" 
          trendUp={true} 
          color="purple" 
          variant="gauge"
          tooltip="AI-assessed confidence score from mock interviews."
        />
         <StatsCard 
          title="Job Match Score" 
          value="92%" 
          icon={Target} 
          trend="Top 5%" 
          trendUp={true} 
          color="emerald" 
          variant="circular"
          tooltip="Average match score with your top job recommendations."
        />
      </div>

      {/* 3. AI Insights Strip */}
      <AIInsights />

      {/* 4. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Career Growth Chart */}
        <div className="lg:col-span-8 h-full">
          <InteractiveAnalytics />
        </div>
        {/* Right: Skill Radar */}
        <div className="lg:col-span-4 h-full">
          <SkillRadar />
        </div>
      </div>

      {/* 5. Activity & Gamification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Activity Heatmap */}
        <div className="lg:col-span-8 h-full">
          <ActivityHeatmap />
        </div>
        {/* Right: Gamification (XP, Level, Badges) */}
        <div className="lg:col-span-4 h-full">
          <Achievements />
        </div>
      </div>

      {/* 6. Smart Actions, Job Matches, Upcoming Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SmartActions setActiveTab={setActiveTab} />
        
        <JobMatches />
        
        <UpcomingTasks />
      </div>

      {/* Goals Modal */}
      <AnimatePresence>
        {showGoals && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Current Goals
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">Track your progress towards success</p>
                </div>
                <button 
                  onClick={() => setShowGoals(false)}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            goal.category === 'Learning' ? 'bg-blue-500/10 text-blue-400' :
                            goal.category === 'Career' ? 'bg-purple-500/10 text-purple-400' :
                            goal.category === 'Practice' ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {goal.category}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {goal.date}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-200 group-hover:text-white transition-colors">{goal.title}</h3>
                      </div>
                      <span className="text-sm font-bold text-indigo-400">{goal.progress}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${goal.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          goal.progress >= 80 ? 'bg-emerald-500' :
                          goal.progress >= 50 ? 'bg-indigo-500' :
                          'bg-amber-500'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-white/10 bg-slate-900/50 flex justify-end">
                <button 
                  onClick={() => setShowGoals(false)}
                  className="bg-indigo-600/80 backdrop-blur-md hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-indigo-500/20 border border-indigo-400/30"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Overview;