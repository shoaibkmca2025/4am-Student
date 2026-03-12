import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Circle } from 'lucide-react';

interface QuestionStatus {
  answered: boolean;
  marked: boolean;
  active: boolean;
}

interface NavigatorPanelProps {
  questions: any[];
  currentIndex: number;
  answers: Record<number, any>;
  markedQuestions: number[];
  onNavigate: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NavigatorPanel: React.FC<NavigatorPanelProps> = ({ 
  questions, 
  currentIndex, 
  answers, 
  markedQuestions, 
  onNavigate, 
  isOpen, 
  onClose 
}) => {
  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: isOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-sky-200 z-50 p-6 shadow-2xl overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Question Map</h3>
        <button 
          onClick={onClose}
          className="text-slate-600 hover:text-slate-800 p-2 rounded-lg hover:bg-sky-100/50 transition-colors"
        >
          &times;
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {questions.map((_, idx) => {
          const isAnswered = answers[idx] !== undefined;
          const isMarked = markedQuestions.includes(idx);
          const isActive = currentIndex === idx;

          let bgClass = 'bg-sky-100/50 border-sky-200/50 text-slate-600 hover:bg-sky-100 hover:text-slate-800';
          if (isActive) bgClass = 'bg-primary text-white border-primary ring-2 ring-primary/20 scale-105 z-10 shadow-lg shadow-primary/20';
          else if (isMarked) bgClass = 'bg-warning/10 border-warning/30 text-warning hover:bg-warning/20';
          else if (isAnswered) bgClass = 'bg-success/10 border-success/30 text-success hover:bg-success/20';

          return (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`aspect-square rounded-lg border font-bold text-sm flex items-center justify-center transition-all duration-200 relative ${bgClass}`}
            >
              {idx + 1}
              {isMarked && !isActive && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-warning rounded-full shadow-sm" />}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 border-t border-sky-200/50 pt-6">
        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-success/20 border border-success/50" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-warning/20 border border-warning/50" />
          <span>Marked for Review</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 font-medium">
          <div className="w-3 h-3 rounded-full bg-sky-100 border border-sky-200" />
          <span>Not Visited</span>
        </div>
      </div>
    </motion.div>
  );
};

export default NavigatorPanel;

