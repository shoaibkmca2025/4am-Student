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
import { jobService, userAssessmentService, applicationService, interviewService, careerService, resumeService } from '../../services/api';

interface OverviewProps {
  userName: string;
  setActiveTab: (tab: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ userName, setActiveTab }) => {
  const [skillPoints, setSkillPoints] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [motivation, setMotivation] = useState('');
  const [showGoals, setShowGoals] = useState(false);
  
  // Real Data States
  const [goals, setGoals] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [careerReadiness, setCareerReadiness] = useState(0);
  const [skillsData, setSkillsData] = useState<any[]>([]);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [interviewConfidence, setInterviewConfidence] = useState(0);
  const [jobMatchScore, setJobMatchScore] = useState(0);
  const [resumeScore, setResumeScore] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<number[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [completedTests, setCompletedTests] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Load User Assessments from Backend
        let fetchedTests: any[] = [];
        try {
          const assessmentData = await userAssessmentService.getMe();
          if (assessmentData && assessmentData.assessments) {
            fetchedTests = assessmentData.assessments.filter((a: any) => a.status === 'Completed');
          }
        } catch (e) {
          console.error("Failed to fetch assessments", e);
          fetchedTests = [];
        }
        setCompletedTests(fetchedTests);

        // 2. Calculate Skill Points
        const points = fetchedTests.length * 100;
        setSkillPoints(points);

        // 3. Calculate Streak
        setStreak(fetchedTests.length > 0 ? 1 : 0);

        // 4. Calculate Career Readiness
        const readiness = fetchedTests.length > 0 ? Math.min(10 + (fetchedTests.length * 5), 100) : 0;
        setCareerReadiness(readiness);

        // 5. Generate Skill Radar Data
        if (fetchedTests.length > 0) {
           const skillMap: Record<string, number> = {};
           fetchedTests.forEach(test => {
             const title = test.title || test.assessmentId?.toString() || 'Skill';
             const subject = title.split(/\s+/)[0];
             skillMap[subject] = (skillMap[subject] || 0) + (parseInt(String(test.score)) || 0);
           });
           
           const chartData = Object.keys(skillMap).map(key => ({
             subject: key,
             A: skillMap[key],
             fullMark: 100
           }));
           setSkillsData(chartData);
        } else {
          setSkillsData([]);
        }

        // 6. Fetch Applications Count
        try {
          const appData = await applicationService.mine();
          setApplicationsCount(appData.applications ? appData.applications.length : 0);
        } catch (e) {
          console.warn("Failed to fetch applications count", e);
        }

        // 7. Fetch Resume & score completeness
        try {
          const resumeResp = await resumeService.getMe();
          const resume = resumeResp?.resume || {};
          const sections = [
            Boolean(resume.summary || resume.objective || resume.headline),
            Array.isArray(resume.experience) && resume.experience.length > 0,
            Array.isArray(resume.education) && resume.education.length > 0,
            Array.isArray(resume.skills) && resume.skills.length > 3,
            Array.isArray(resume.projects) && resume.projects.length > 0,
            Boolean(resume.contact || resume.email || resume.phone)
          ];
          const filled = sections.filter(Boolean).length;
          const score = Math.min(100, Math.round((filled / sections.length) * 100));
          setResumeScore(score);
        } catch (e) {
          console.warn("Failed to fetch resume", e);
          setResumeScore(0);
        }

        // 8. Fetch Interview Confidence
        try {
          const sessionData = await interviewService.getSessions();
          if (sessionData && sessionData.sessions) {
             const completed = sessionData.sessions.filter((s: any) => s.status === 'completed');
             // Simple logic: 1 point per completed session, max 5
             setInterviewConfidence(Math.min(completed.length, 5));
          }
        } catch (e) {
          console.warn("Failed to fetch interview sessions", e);
        }

        // 9. Fetch Career Goals (Roadmap)
        try {
          const roadmapData = await careerService.getRoadmap();
          if (roadmapData && roadmapData.roadmap) {
            const nextSteps = roadmapData.roadmap
              .filter((step: any) => step.status === 'In Progress' || step.status === 'Locked')
              .slice(0, 3)
              .map((step: any, index: number) => ({
                ...step,
                category: step.status === 'In Progress' ? 'Learning' : 'Career',
                date: `Week ${index + 1}`,
                progress: Number.isFinite(step.progress) ? step.progress : 0
              }));
            setGoals(nextSteps);
          }
        } catch (e) {
           console.warn("Failed to fetch career roadmap", e);
        }

        // 10. Calculate Activity Heatmap
        const activityMap = new Array(52 * 7).fill(0);
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - (52 * 7));

        fetchedTests.forEach((test: any) => {
            const dateStr = test.completedAt || test.updatedAt || test.createdAt;
            if (dateStr) {
                const testDate = new Date(dateStr);
                const diffTime = testDate.getTime() - startDate.getTime();
                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays >= 0 && diffDays < activityMap.length) {
                    activityMap[diffDays] = Math.min(activityMap[diffDays] + 1, 4);
                }
            }
        });
        setActivityData(activityMap);

        // Random Motivation
        if (fetchedTests.length > 0) {
            const quotes = [
            "You're improving fast! Keep pushing.",
            "Small steps every day lead to big results.",
            "Focus on the process, and the results will follow.",
            ];
            setMotivation(quotes[Math.floor(Math.random() * quotes.length)]);
        } else {
            setMotivation("Ready to start your journey? Take your first skill assessment!");
        }

        // Build AI insights based on current data
        const nextInsights: any[] = [];
        if (resumeScore > 0) {
          nextInsights.push({
            text: `Resume strength at ${resumeScore}%. Add more projects or skills to reach 90%.`,
            type: 'suggestion'
          });
        }
        if (careerReadiness > 0) {
          nextInsights.push({
            text: `Career readiness at ${careerReadiness}%. Completing one more assessment can boost it by ~5%.`,
            type: 'action'
          });
        }
        if (interviewConfidence > 0) {
          nextInsights.push({
            text: `Interview readiness improving. Schedule another mock to push confidence above ${Math.min(100, (interviewConfidence + 1) * 20)}%.`,
            type: 'positive'
          });
        }
        if (applicationsCount === 0 && jobMatchScore === 0) {
          nextInsights.push({
            text: 'Apply to at least one tailored job this week to unlock match insights.',
            type: 'action'
          });
        }
        if (nextInsights.length === 0 && fetchedTests.length === 0) {
          nextInsights.push({
            text: 'Take your first assessment to unlock personalized insights.',
            type: 'action'
          });
        }
        setInsights(nextInsights);

      } catch (error) {
        console.error("Overview data fetch error", error);
      }
    };

    fetchData();

    // 10. Fetch Jobs (Separate call)
    const fetchJobs = async () => {
      try {
        const data = await jobService.list();
        if (data && Array.isArray(data.jobs)) {
           const transformed = data.jobs.slice(0, 3).map((j: any) => ({
             id: j.id || j._id, // Ensure ID is preserved
             role: j.title,
             company: j.companyName || 'Company',
             match: Math.floor(Math.random() * 20) + 80, 
             type: j.type || 'Full-time',
             salary: j.salaryRange || 'Competitive',
             logo: (j.companyName || 'C').charAt(0).toUpperCase(),
             color: 'bg-indigo-500',
             reasons: { positive: ['Skills match', 'Location'], negative: [] }
           }));
           setJobs(transformed);
        }
      } catch (e) {
        console.error("Failed to fetch jobs for overview", e);
      }
    };
    fetchJobs();

    // Dynamic Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

  }, []);

  const handleApplyJob = async (jobId: string) => {
    try {
      await jobService.apply(jobId, {});
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Failed to apply for job", error);
      alert("Failed to apply for job. Please try again.");
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Welcome Banner - Premium Redesign */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl relative overflow-hidden group"
      >
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
        
        <div className="relative z-10 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 mb-1">
              {streak > 5 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center gap-1.5">
                <Crown className="w-3 h-3" />
                Premium Member
              </span>
              )}
              {careerReadiness > 50 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3" />
                Top Performer
              </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{userName}</span>
            </h1>
            
            <p className="text-slate-700 dark:text-gray-300 text-sm leading-relaxed max-w-xl font-medium">
              {motivation}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
               <div className="flex items-center gap-2 bg-sky-100/50 dark:bg-cyan-500/10 p-1 pr-2.5 rounded-full border border-sky-200/50 dark:border-cyan-500/20 backdrop-blur-sm">
                  <div className="p-1 bg-amber-500/20 rounded-full text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-500/20" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-600 dark:text-gray-400 uppercase tracking-wider font-semibold">Streak</p>
                    <p className="text-[11px] font-bold text-slate-900 dark:text-white">{streak} Days</p>
                  </div>
               </div>
               
               <div className="h-5 w-px bg-sky-200/50 dark:bg-white/10 hidden sm:block"></div>
               
               <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-gray-400 text-[11px]">Level:</span>
                  <div className="w-20 h-1.5 bg-sky-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(skillPoints / 10, 100)}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-indigo-400">{Math.floor(skillPoints / 100)}</span>
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
            {goals.length > 0 && (
            <button 
              onClick={() => setShowGoals(true)}
              className="saas-button-secondary flex items-center justify-center gap-2 backdrop-blur-sm bg-sky-100/30 hover:bg-sky-100/50 py-2 px-4 text-sm"
            >
              <Target className="w-4 h-4 text-slate-600 group-hover:text-primary transition-colors" />
              <span>View Goals</span>
            </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. KPI Metrics Row (Advanced Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Career Readiness Breakdown - Spans 2 Columns */}
        <TiltCard 
          className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 relative overflow-hidden group"
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
                       <h3 className="text-base font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">Career Readiness</h3>
                       <p className="text-[10px] text-slate-600 dark:text-gray-400">AI-Calculated Probability</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-lg text-[10px] font-medium group-hover:scale-105 transition-transform duration-300">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{Math.min(streak, 100)}% this week</span>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                 {/* Main Circular Score */}
                 <div className="relative w-24 h-24 flex-shrink-0 group-hover:scale-110 transition-transform duration-500" style={{ transform: 'translateZ(30px)' }}>
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200 dark:text-slate-700" />
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="251" strokeDashoffset={251 - (251 * (careerReadiness / 100))} strokeLinecap="round" className="text-indigo-500 transition-all duration-1000 ease-out" />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{careerReadiness}%</span>
                        <span className="text-[9px] text-slate-600 dark:text-gray-400 uppercase tracking-wider font-semibold">{careerReadiness > 70 ? 'Ready' : careerReadiness > 40 ? 'Learning' : 'Starter'}</span>
                     </div>
                 </div>

                 {/* Breakdown Metrics */}
                 <div className="flex-1 w-full space-y-2">
                    {[
                       { label: 'Resume Quality', value: resumeScore, color: 'bg-emerald-500', icon: FileText, tip: resumeScore > 0 ? 'Based on your resume sections.' : 'Upload or complete your resume to get a score.' },
                       { label: 'Skills Match', value: skillsData.length > 0 ? Math.min(Math.round(skillsData.reduce((acc: number, s: any) => acc + (s.A || 0), 0) / skillsData.length), 100) : 0, color: 'bg-blue-500', icon: Code, tip: 'Based on your completed assessments.' },
                       { label: 'Interview Readiness', value: interviewConfidence > 0 ? interviewConfidence * 20 : 0, color: 'bg-purple-500', icon: MessageSquare, tip: 'Complete mock interviews to improve.' },
                    ].map((metric, idx) => (
                       <div key={idx} className="group/metric relative cursor-help">
                          <div className="flex justify-between text-[10px] mb-1">
                             <span className="text-slate-700 dark:text-gray-300 flex items-center gap-1.5 font-medium">
                                <metric.icon className="w-3 h-3 text-slate-500" /> {metric.label}
                             </span>
                             <span className="text-slate-800 dark:text-white font-bold">{metric.value}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-sky-100 dark:bg-slate-700 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                transition={{ delay: 0.5 + (idx * 0.1), duration: 1 }}
                                className={`h-full ${metric.color}`}
                             />
                          </div>
                          
                          {/* Hover Tooltip */}
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[150px] p-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-sky-200/50 dark:border-white/10 rounded-lg text-[10px] text-slate-700 dark:text-gray-300 opacity-0 invisible group-hover/metric:opacity-100 group-hover/metric:visible transition-all duration-200 z-50 pointer-events-none shadow-xl">
                             {metric.tip}
                             <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 bg-white/95 transform rotate-45 border-r border-b border-sky-200/50"></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              {/* AI Insight Footer */}
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-start gap-2 bg-gradient-to-r from-amber-500/5 to-transparent -mx-5 -mb-5 p-3">
                 <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
                 <p className="text-xs text-slate-700 dark:text-gray-300 leading-snug">
                    <span className="text-amber-400 font-bold">AI Insight:</span> {careerReadiness === 0 ? "Complete your first assessment to unlock personalized career insights." : "Keep learning to increase your career readiness score."}
                 </p>
              </div>
           </div>
        </TiltCard>

        <StatsCard 
          title="Applications" 
          value={applicationsCount.toString()} 
          icon={Briefcase} 
          trend={applicationsCount > 0 ? "Active" : "No Activity"} 
          trendUp={applicationsCount > 0} 
          color="secondary" 
          variant="chart"
          data={[]}
          tooltip="Total job applications sent this month."
        />
        <StatsCard 
          title="Skill Points" 
          value={skillPoints.toString()} 
          icon={Code} 
          trend={`Lvl ${Math.floor(skillPoints / 100)}`} 
          trendUp={skillPoints > 0} 
          color="accent" 
          progress={skillPoints % 100}
          variant="bar"
          tooltip="XP earned from completing assessments and challenges."
        />
        <StatsCard 
          title="Interview Conf." 
          value={interviewConfidence > 0 ? `${interviewConfidence}/5` : "-"} 
          icon={MessageSquare} 
          trend={interviewConfidence > 0 ? "Ready" : "Not Started"} 
          trendUp={interviewConfidence > 3} 
          color="purple" 
          variant="gauge"
          tooltip="AI-assessed confidence score from mock interviews."
        />
         <StatsCard 
          title="Job Match Score" 
          value={jobMatchScore > 0 ? `${jobMatchScore}%` : "-"} 
          icon={Target} 
          trend={jobMatchScore > 0 ? "Top Matches" : "No Matches"} 
          trendUp={jobMatchScore > 50} 
          color="emerald" 
          variant="circular"
          tooltip="Average match score with your top job recommendations."
        />
      </div>

      {/* 3. AI Insights Strip */}
      <AIInsights insights={insights} />

      {/* 4. Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Career Growth Chart */}
        <div className="lg:col-span-8 h-full">
          <InteractiveAnalytics completedTests={completedTests} />
        </div>
        {/* Right: Skill Radar */}
        <div className="lg:col-span-4 h-full">
          <SkillRadar data={skillsData} />
        </div>
      </div>

      {/* 5. Activity & Gamification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Activity Heatmap */}
        <div className="lg:col-span-8 h-full">
          <ActivityHeatmap activityData={activityData} />
        </div>
        {/* Right: Gamification (XP, Level, Badges) */}
        <div className="lg:col-span-4 h-full">
          <Achievements streak={streak} />
        </div>
      </div>

      {/* 6. Smart Actions, Job Matches, Upcoming Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SmartActions setActiveTab={setActiveTab} />
        
        <JobMatches jobs={jobs} onApply={handleApplyJob} />
        
        <UpcomingTasks />
      </div>

      {/* Goals Modal */}
      <AnimatePresence>
        {showGoals && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-50/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-sky-200 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-sky-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-400" />
                    Current Goals
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">Track your progress towards success</p>
                </div>
                <button 
                  onClick={() => setShowGoals(false)}
                  className="p-2 hover:bg-sky-100 rounded-full text-slate-600 hover:text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {goals.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>No goals set yet.</p>
                    <p className="text-xs mt-2">Start assessments to track your progress!</p>
                  </div>
                ) : (
                  goals.map((goal: any) => (
                    <div key={goal.id} className="p-4 rounded-xl bg-sky-100/50 border border-sky-200/50 hover:border-indigo-500/30 transition-colors group">
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
                          <h3 className="font-semibold text-slate-800 group-hover:text-primary transition-colors">{goal.title}</h3>
                        </div>
                        <span className="text-sm font-bold text-indigo-400">{goal.progress}%</span>
                      </div>
                      
                      <div className="w-full h-2 bg-sky-200 rounded-full overflow-hidden">
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
                  ))
                )}
              </div>

              <div className="p-4 border-t border-white/10 bg-white/50 flex justify-end">
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


