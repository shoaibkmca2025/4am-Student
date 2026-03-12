import React from 'react';
import { ArrowLeft, ArrowRight, Flag, Save } from 'lucide-react';

interface ActionBarProps {
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onMarkForReview: () => void;
  isFirst: boolean;
  isLast: boolean;
  isMarked: boolean;
  canNext: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ 
  onNext, 
  onPrevious, 
  onSubmit, 
  onMarkForReview, 
  isFirst, 
  isLast, 
  isMarked, 
  canNext 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-40 p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <button 
            onClick={onPrevious}
            disabled={isFirst}
            className={`saas-button-secondary flex items-center gap-2 ${
              isFirst ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          
          <button 
            onClick={onMarkForReview}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-bold ${
              isMarked 
                ? 'bg-warning/10 border-warning/50 text-warning hover:bg-warning/20' 
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Flag className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
            <span className="hidden sm:inline">{isMarked ? 'Marked' : 'Mark for Review'}</span>
          </button>
        </div>

        <div className="flex gap-3">
          {isLast ? (
            <button 
              onClick={onSubmit}
              className="px-6 py-2.5 bg-success hover:bg-emerald-500 text-white rounded-lg font-bold text-sm border border-success/50 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-success/20"
            >
              <Save className="w-4 h-4" />
              <span>Submit Test</span>
            </button>
          ) : (
            <button 
              onClick={onNext}
              disabled={!canNext} 
              className={`saas-button-primary flex items-center gap-2 ${
                !canNext ? 'opacity-50 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500 shadow-none hover:bg-slate-800 transform-none' : ''
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
