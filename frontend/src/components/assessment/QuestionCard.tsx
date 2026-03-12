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
  correctAnswer,
  showFeedback = false,
  codeSnippet
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="saas-card p-6 md:p-8 relative overflow-hidden"
    >
      
      <div className="flex items-start gap-4 mb-8 relative z-10">
        <div className="p-3 bg-slate-800 rounded-lg border border-slate-700">
          {type === 'code-challenge' ? <Code className="w-6 h-6 text-violet-400" /> :
           type === 'text-input' ? <Type className="w-6 h-6 text-sky-400" /> :
           <span className="text-xl font-bold text-slate-400">?</span>}
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-200 leading-snug">
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
            disabled={showFeedback}
          />
        ))}

        {type === 'code-challenge' && (
          <div className="relative">
            <div className="absolute top-0 right-0 p-2 text-xs text-slate-500 bg-slate-900 rounded-bl-lg border-l border-b border-slate-700">
              JavaScript
            </div>
            <textarea
              value={selectedOption as string || codeSnippet || ''}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full h-64 bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
              spellCheck={false}
              placeholder="// Write your solution here..."
            />
          </div>
        )}

        {type === 'text-input' && (
          <textarea
            value={selectedOption as string || ''}
            onChange={(e) => onSelect(e.target.value)}
            className="w-full h-40 bg-slate-900/50 text-slate-200 p-4 rounded-lg border border-slate-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
            placeholder="Type your answer here..."
          />
        )}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
