import React, { useState, useEffect } from 'react';
import { 
  Code, CheckCircle, Clock, PlayCircle, Trophy, RotateCw, 
  HelpCircle, ArrowRight, Zap, Target, Star, MoreHorizontal 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard';
import { TESTS_METADATA } from '../../data/assessments';

const SkillTests: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [tests, setTests] = useState<any[]>([]);

  useEffect(() => {
    // Load progress from localStorage
    const savedAssessments = JSON.parse(localStorage.getItem('user_assessments') || '{}');
    
    const updatedTests = TESTS_METADATA.map(test => {
      const saved = savedAssessments[test.id];
      // Default state
      let status = 'Pending';
      let score = '-';
      
      if (saved) {
        status = saved.status;
        score = saved.score;
      }

      return {
        ...test,
        status,
        score
      };
    });
    
    setTests(updatedTests);
  }, []);

  const filteredTests = activeTab === 'All' 
    ? tests 
    : tests.filter(test => test.category === activeTab);

  const startTest = (testId: number) => {
    navigate(`/assessment/${testId}`);
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Skill Assessments</h2>
          <p className="text-slate-400">Verify your skills and earn badges for your profile.</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-1 flex space-x-1 border border-slate-700">
          {['All', 'Technical', 'Soft Skills'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-slate-700 text-slate-100 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test, index) => {
          const isCompleted = test.status === 'Completed';
          const isInProgress = test.status === 'In Progress'; // Assuming this status exists or will be used
          
          // Difficulty Color Logic
          const difficultyColor = 
            test.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
            test.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
            'text-rose-400 bg-rose-500/10 border-rose-500/20';

          return (
            <TiltCard 
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-0 h-full flex flex-col overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300"
            >
              {/* Card Header & Content Padding */}
              <div className="p-6 flex flex-col h-full relative z-10">
                
                {/* 1. Header Area */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-4">
                    {/* Skill Icon in Gradient Square */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/10">
                      <Code className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors leading-tight mb-1">
                        {test.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <CheckCircle className="w-3 h-3" /> Completed
                          </span>
                        ) : isInProgress ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            <Zap className="w-3 h-3" /> In Progress
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 animate-pulse">
                            <Star className="w-3 h-3" /> New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Context Menu / More Options (Optional visual element) */}
                  <button className="text-slate-600 hover:text-slate-300 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* 2. Metadata Row (Compact Chips) */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {test.duration}
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-400">
                    <HelpCircle className="w-3.5 h-3.5" /> {test.questions} Qs
                  </span>
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColor}`}>
                    <Target className="w-3.5 h-3.5" /> {test.difficulty}
                  </span>
                </div>

                {/* Spacer to push footer down */}
                <div className="flex-grow"></div>

                {/* Divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-5"></div>

                {/* 3. Footer / CTA Area */}
                {isCompleted ? (
                  <div className="space-y-3">
                    {/* Score Bar */}
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-medium">Score Achieved</span>
                      <span className="text-emerald-400 font-bold">{test.score}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: test.score }} // Assuming score is like "85%"
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                       <button 
                        onClick={() => startTest(test.id)}
                        className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg py-2 transition-all hover:shadow-lg"
                      >
                        <RotateCw className="w-3.5 h-3.5" /> Retake
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg py-2 transition-all">
                        <Trophy className="w-3.5 h-3.5" /> Certificate
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => startTest(test.id)}
                    className="group/btn w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-[1px] transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:scale-[1.02]"
                  >
                    <div className="relative flex items-center justify-center gap-2 bg-slate-900/50 hover:bg-transparent backdrop-blur-sm w-full h-full px-4 py-2.5 rounded-xl transition-all duration-300 group-hover/btn:text-white">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        Start Assessment <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
};

export default SkillTests;
