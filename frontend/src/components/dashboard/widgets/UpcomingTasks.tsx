import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Code, Users, ArrowRight } from 'lucide-react';
import { userAssessmentService } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

const UpcomingTasks: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // Fetch in-progress assessments
        const data = await userAssessmentService.getMe();
        if (data && data.assessments) {
          const inProgress = data.assessments
            .filter((a: any) => a.status === 'In Progress')
            .map((a: any) => ({
              id: a.assessmentId,
              title: `Complete ${a.title || 'Assessment'}`,
              type: 'assessment',
              icon: Code,
              color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
              due: 'Self-paced'
            }));
          setTasks(inProgress);
        }
      } catch (error) {
        console.error('Failed to fetch tasks', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-orange-400" />
          Pending Tasks
        </h3>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="space-y-3 flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 bg-sky-100/50 rounded-full flex items-center justify-center mb-3 border border-sky-200">
             <Calendar className="w-6 h-6 text-slate-500" />
          </div>
          <h4 className="text-slate-800 font-bold text-sm">No Pending Tasks</h4>
          <p className="text-slate-600 text-xs mt-1 max-w-[200px]">
             Your schedule is clear. Start a new assessment to challenge yourself!
          </p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Browse Assessments
          </button>
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
          {tasks.map((task, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-sky-100/40 border border-sky-200/50 hover:bg-sky-100/60 transition-colors group cursor-pointer" onClick={() => navigate(`/assessment/${task.id}`)}>
              <div className={`p-2 rounded-lg ${task.color}`}>
                <task.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-primary transition-colors">{task.title}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                   <span className="text-[10px] text-slate-600 flex items-center gap-1">
                     <Clock className="w-3 h-3" /> {task.due}
                   </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingTasks;


