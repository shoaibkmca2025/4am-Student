import React from 'react';
import { Target, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

const CareerPath: React.FC = () => {
  const roadmap = [
    {
      id: 1,
      title: 'Frontend Fundamentals',
      status: 'Completed',
      skills: ['HTML', 'CSS', 'JavaScript'],
      progress: 100
    },
    {
      id: 2,
      title: 'React & State Management',
      status: 'In Progress',
      skills: ['React Hooks', 'Redux', 'Context API'],
      progress: 65
    },
    {
      id: 3,
      title: 'Backend Basics',
      status: 'Pending',
      skills: ['Node.js', 'Express', 'API Design'],
      progress: 0
    },
    {
      id: 4,
      title: 'Database Management',
      status: 'Locked',
      skills: ['MongoDB', 'SQL', 'Mongoose'],
      progress: 0
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Career Roadmap</h2>
          <p className="text-slate-400">Your personalized path to becoming a Full Stack Developer</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <span className="font-medium text-slate-200">Target Role:</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold border border-primary/20">
            Senior Full Stack Engineer
          </span>
        </div>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-6 space-y-12 pb-12">
        {roadmap.map((step, index) => (
          <div key={step.id} className="relative pl-12 group">
            {/* Timeline Connector */}
            <div 
              className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${
                step.status === 'Completed' 
                  ? 'bg-success border-success' 
                  : step.status === 'In Progress'
                    ? 'bg-primary border-primary ring-2 ring-primary/20'
                    : 'bg-slate-900 border-slate-700'
              }`}
            ></div>

            {/* Content Card */}
            <div className={`saas-card p-6 transition-all duration-300 ${
              step.status === 'In Progress' 
                ? 'border-primary/50 bg-primary/5' 
                : 'hover:border-slate-600'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${
                    step.status === 'Completed' ? 'text-success' : 
                    step.status === 'In Progress' ? 'text-primary' : 'text-slate-200'
                  }`}>
                    {step.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{step.skills.join(' • ')}</span>
                  </div>
                </div>
                {step.status === 'Completed' && (
                  <div className="bg-success/10 p-2 rounded-lg text-success">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                {step.status === 'In Progress' && (
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Target className="w-5 h-5 animate-spin-slow" />
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>Progress</span>
                  <span>{step.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      step.status === 'Completed' ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              {step.status === 'In Progress' && (
                <button className="mt-6 w-full py-3 saas-button-secondary flex items-center justify-center gap-2 group">
                  Continue Learning <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerPath;
