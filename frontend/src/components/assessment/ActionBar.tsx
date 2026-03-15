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
  isDisabled?: boolean;
  isSubmitting?: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ 
  onNext, 
  onPrevious, 
  onSubmit, 
  onMarkForReview, 
  isFirst, 
  isLast, 
  isMarked, 
  canNext,
  isDisabled = false,
  isSubmitting = false
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-sky-200 z-40 p-3 sm:p-4 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
          <button 
            onClick={onPrevious}
            disabled={isFirst || isDisabled}
            className={`saas-button-secondary flex items-center gap-2 ${
              (isFirst || isDisabled) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs sm:text-sm">Previous</span>
          </button>
          
          <button 
            onClick={onMarkForReview}
            disabled={isDisabled}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200 text-sm font-bold ${
              isMarked 
                ? 'bg-warning/10 border-warning/50 text-warning hover:bg-warning/20' 
                : 'bg-sky-100 border-sky-200 text-slate-600 hover:text-slate-800 hover:bg-sky-200'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Flag className={`w-4 h-4 ${isMarked ? 'fill-current' : ''}`} />
            <span className="text-xs sm:text-sm">{isMarked ? 'Marked' : 'Mark for Review'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:flex gap-2 sm:gap-3">
          {isLast ? (
            <button 
              onClick={onSubmit}
              disabled={isDisabled}
              className={`px-6 py-2.5 bg-success hover:bg-emerald-500 text-white rounded-lg font-bold text-sm border border-success/50 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 shadow-lg shadow-success/20 ${isDisabled ? 'opacity-60 cursor-not-allowed hover:bg-success transform-none' : ''}`}
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Test'}</span>
            </button>
          ) : (
            <button 
              onClick={onNext}
              disabled={!canNext || isDisabled} 
              className={`saas-button-primary flex items-center gap-2 ${
                (!canNext || isDisabled) ? 'opacity-50 cursor-not-allowed bg-sky-100 border-sky-200 text-slate-500 shadow-none hover:bg-sky-100 transform-none' : ''
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

