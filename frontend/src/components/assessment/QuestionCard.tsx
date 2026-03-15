import React from 'react';
import { motion } from 'framer-motion';
import OptionCard from './OptionCard';
import { Code, Type } from 'lucide-react';

interface QuestionCardProps {
  type?: 'multiple-choice' | 'code-challenge' | 'text-input';
  question: string;
  options?: string[];
  selectedOption: number | string | null;
  onSelect: (answer: any) => void;
  disabled?: boolean;
  correctAnswer?: number | string; // Optional, only if we want immediate feedback
  showFeedback?: boolean; // Whether to reveal the correct answer
  codeSnippet?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  type = 'multiple-choice',
  question,
  options = [],
  selectedOption,
  onSelect,
  disabled = false,
  correctAnswer,
  showFeedback = false,
  codeSnippet
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="saas-card p-4 sm:p-6 md:p-8 relative overflow-hidden"
    >
      
      <div className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
        <div className="p-2.5 sm:p-3 bg-sky-100 rounded-lg border border-sky-200 shrink-0">
          {type === 'code-challenge' ? <Code className="w-6 h-6 text-violet-400" /> :
           type === 'text-input' ? <Type className="w-6 h-6 text-sky-400" /> :
           <span className="text-xl font-bold text-slate-600">?</span>}
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 leading-snug break-words">
          {question}
        </h2>
      </div>

      <div className="space-y-3 relative z-10">
        {type === 'multiple-choice' && options.map((option, idx) => (
          <OptionCard
            key={idx}
            index={idx}
            option={option}
            selected={selectedOption === idx}
            correct={showFeedback ? (correctAnswer === idx) : null}
            onSelect={() => onSelect(idx)}
            disabled={showFeedback || disabled}
          />
        ))}

        {type === 'code-challenge' && (
          <div className="relative">
            <div className="absolute top-0 right-0 p-2 text-xs text-slate-500 bg-white rounded-bl-lg border-l border-b border-sky-200">
              JavaScript
            </div>
            <textarea
              value={selectedOption as string || codeSnippet || ''}
              onChange={(e) => onSelect(e.target.value)}
              disabled={disabled}
              className="w-full h-64 bg-sky-50 text-slate-700 font-mono text-sm p-4 rounded-lg border border-sky-200 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none disabled:opacity-70 disabled:cursor-not-allowed"
              spellCheck={false}
              placeholder="// Write your solution here..."
            />
          </div>
        )}

        {type === 'text-input' && (
          <textarea
            value={selectedOption as string || ''}
            onChange={(e) => onSelect(e.target.value)}
            disabled={disabled}
            className="w-full h-40 bg-white/50 text-slate-800 p-4 rounded-lg border border-sky-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none disabled:opacity-70 disabled:cursor-not-allowed"
            placeholder="Type your answer here..."
          />
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;

