import React, { useState, useEffect } from 'react';
import { 
  Briefcase, FileText, Code, MessageSquare, TrendingUp, 
  ArrowRight, Star, Clock, MapPin, Zap, BookOpen, Crown, Video,
  CheckCircle, Target, Sparkles, Trophy, Flame, X, Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatsCard from './StatsCard';
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
        className="saas-card relative overflow-hidden group"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        
        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                Premium Member
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Top 10%
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{userName}</span>
            </h1>
            
            <p className="text-slate-300 text-lg leading-relaxed max-w-xl font-medium">
              {motivation}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
               <div className="flex items-center gap-3 bg-slate-800/50 p-2 pr-4 rounded-full border border-slate-700/50 backdrop-blur-sm">
                  <div className="p-2 bg-amber-500/20 rounded-full text-amber-400">
                    <Flame className="w-5 h-5 fill-amber-500/20" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Current Streak</p>
                    <p className="text-sm font-bold text-white">5 Days</p>
                  </div>
               </div>
               
               <div className="h-8 w-px bg-slate-700/50 hidden sm:block"></div>
               
               <div className="flex items-center gap-2">
                  <span className="text-slate-400 text-sm">Next Level:</span>
                  <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <span className="text-xs font-bold text-indigo-400">75%</span>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
            <button 
              onClick={() => setActiveTab('skills')}
              className="saas-button-primary flex items-center justify-center gap-2 group shadow-lg shadow-indigo-500/20"
            >
              <BookOpen className="w-5 h-5" />
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowGoals(true)}
              className="saas-button-secondary flex items-center justify-center gap-2 backdrop-blur-sm bg-slate-800/30 hover:bg-slate-800/50"
            >
              <Target className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span>View Goals</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Metrics Row (Advanced Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatsCard 
          title="Career Readiness" 
          value="78%" 
          icon={TrendingUp} 
          trend="+12% this week" 
          trendUp={true} 
          color="primary" 
          progress={78}
          variant="circular"
          tooltip="Overall readiness based on resume, skills, and mock interviews."
        />
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

              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                <button 
                  onClick={() => setShowGoals(false)}
                  className="saas-button-primary"
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