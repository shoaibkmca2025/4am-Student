import React, { useState, useEffect } from 'react';
import { Code, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="saas-card p-6 flex flex-col group h-full">
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-primary/30 group-hover:text-primary transition-colors`}>
                <Code className="w-6 h-6" />
              </div>
              {test.status === 'Completed' ? (
                <span className="bg-success/10 text-success px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border border-success/20">
                  <CheckCircle className="w-3 h-3" /> Done
                </span>
              ) : (
                <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-lg text-xs font-bold border border-primary/20">New</span>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-200 mb-2">{test.title}</h3>
            <div className="flex items-center space-x-4 text-xs text-slate-400 mb-6">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration}</span>
              <span>•</span>
              <span>{test.questions} Questions</span>
              <span>•</span>
              <span className={test.difficulty === 'Hard' ? 'text-error' : test.difficulty === 'Medium' ? 'text-warning' : 'text-success'}>
                {test.difficulty}
              </span>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-800/50">
              {test.status === 'Completed' ? (
                <div className="w-full flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Score</span>
                    <span className="text-xl font-bold text-success">{test.score}</span>
                  </div>
                  <button 
                     onClick={() => startTest(test.id)}
                     className="saas-button-secondary text-xs px-3 py-1.5 h-auto min-h-0"
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => startTest(test.id)}
                  className="saas-button-primary w-full justify-center gap-2"
                >
                  Start Assessment
                  <PlayCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillTests;
