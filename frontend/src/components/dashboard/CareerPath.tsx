import React, { useState, useEffect } from 'react';
import { Target, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { careerService } from '../../services/api';

interface CareerPathProps {
  setActiveTab?: (tab: string) => void;
}

const CareerPath: React.FC<CareerPathProps> = ({ setActiveTab }) => {
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        const data = await careerService.getRoadmap();
        if (data && data.roadmap) {
          setRoadmap(data.roadmap);
        }
      } catch (error) {
        console.error('Failed to fetch career roadmap', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Career Roadmap</h2>
          <p className="text-slate-600">Your personalized path will appear here.</p>
        </div>
        {/* <div className="flex items-center space-x-2 text-sm text-slate-600">
          <span className="font-medium text-slate-800">Target Role:</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg font-bold border border-primary/20">
            Senior Full Stack Engineer
          </span>
        </div> */}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading roadmap...</p>
        </div>
      ) : roadmap.length === 0 ? (
        <div className="text-center py-12 bg-sky-100/30 rounded-2xl border border-sky-200/50">
            <Target className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Career Path Active</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">Start taking skill assessments to generate a personalized career roadmap.</p>
            <button 
              onClick={() => setActiveTab && setActiveTab('skills')}
              className="saas-button-primary"
            >
              Start Assessment
            </button>
        </div>
      ) : (
      <div className="relative border-l-2 border-sky-200 ml-6 space-y-12 pb-12">
        {roadmap.map((step, index) => (
          <div key={step.id} className="relative pl-12 group">
            {/* Timeline Connector */}
            <div 
              className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 transition-all duration-500 z-10 ${
                step.status === 'Completed' 
                  ? 'bg-success border-success' 
                  : step.status === 'In Progress'
                    ? 'bg-primary border-primary ring-2 ring-primary/20'
                    : 'bg-white border-sky-200'
              }`}
            ></div>

            {/* Content Card */}
            <div className={`saas-card p-6 transition-all duration-300 ${
              step.status === 'In Progress' 
                ? 'border-primary/50 bg-primary/5' 
                : 'hover:border-sky-300'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${
                    step.status === 'Completed' ? 'text-success' : 
                    step.status === 'In Progress' ? 'text-primary' : 'text-slate-800'
                  }`}>
                    {step.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{step.skills.join(' | ')}</span>
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
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Progress</span>
                  <span>{step.progress}%</span>
                </div>
                <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      step.status === 'Completed' ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default CareerPath;


