import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, TrendingUp, Clock, Target, Share2, Download, RefreshCw } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface ResultAnalyticsProps {
  score: number;
  totalQuestions: number;
  timeTaken: string; // e.g., "12m 30s"
  accuracy: number; // percentage
  percentile: number;
  onRetry: () => void;
  onDashboard: () => void;
}

const ResultAnalytics: React.FC<ResultAnalyticsProps> = ({ 
  score, 
  totalQuestions, 
  timeTaken, 
  accuracy, 
  percentile, 
  onRetry, 
  onDashboard 
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  const radarData = [
    { subject: 'Problem Solving', A: 80, fullMark: 100 },
    { subject: 'Critical Thinking', A: 65, fullMark: 100 },
    { subject: 'Technical Knowledge', A: accuracy, fullMark: 100 },
    { subject: 'Speed', A: 90, fullMark: 100 },
    { subject: 'Adaptability', A: 70, fullMark: 100 },
    { subject: 'Precision', A: 85, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-success/20"
          >
            <CheckCircle className="w-10 h-10 text-success" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-200 tracking-tight">
            Assessment Complete
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">You've mastered this skill assessment. Here's a detailed breakdown of your performance.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="saas-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Score</p>
                <h3 className="text-2xl font-bold text-slate-200">{score}/{totalQuestions}</h3>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full" style={{ width: `${percentage}%` }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="saas-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-success/10 rounded-lg text-success border border-success/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Accuracy</p>
                <h3 className="text-2xl font-bold text-slate-200">{accuracy}%</h3>
              </div>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-success h-full" style={{ width: `${accuracy}%` }} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="saas-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-warning/10 rounded-lg text-warning border border-warning/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Time Taken</p>
                <h3 className="text-2xl font-bold text-slate-200">{timeTaken}</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500">Avg. 45s per question</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="saas-card p-6"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Percentile</p>
                <h3 className="text-2xl font-bold text-slate-200">Top {100 - percentile}%</h3>
              </div>
            </div>
            <p className="text-xs text-slate-500">Better than {percentile}% of peers</p>
          </motion.div>
        </div>

        {/* Detailed Analysis & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Radar Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1 saas-card p-6 flex flex-col items-center justify-center min-h-[400px]"
          >
            <h3 className="text-lg font-bold text-slate-200 mb-6">Skill Breakdown</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="My Skills"
                    dataKey="A"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI Feedback */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 saas-card p-8 space-y-6"
          >
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              AI Performance Analysis
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <h4 className="font-semibold text-success mb-1 text-sm">Strengths</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  You demonstrated exceptional understanding of core concepts. Your response time was significantly faster than average in the logic section, indicating strong problem-solving intuition.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <h4 className="font-semibold text-warning mb-1 text-sm">Areas for Improvement</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Consider reviewing advanced state management patterns. While you answered correctly, the time taken for architectural questions was slightly higher, suggesting potential hesitation in complex scenarios.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-semibold text-primary mb-1 text-sm">Recommended Next Steps</h4>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1 ml-1">
                  <li>Take the "Advanced React Patterns" deep dive module.</li>
                  <li>Practice 3 more coding challenges in the "Algorithms" section.</li>
                  <li>Review the documentation on React Hooks performance optimization.</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <button 
            onClick={onRetry}
            className="saas-button-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Assessment
          </button>
          <button 
            onClick={onDashboard}
            className="saas-button-primary flex items-center gap-2"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default ResultAnalytics;
