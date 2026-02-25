import React from 'react';
import { motion } from 'framer-motion';
import OptionCard from './OptionCard';

interface QuestionCardProps {
  question: string;
  options: string[];
  selectedOption: number | null;
  onSelect: (index: number) => void;
  correctAnswer?: number; // Optional, only if we want immediate feedback
  showFeedback?: boolean; // Whether to reveal the correct answer
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  options,
  selectedOption,
  onSelect,
  correctAnswer,
  showFeedback = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="saas-card p-6 md:p-8 relative overflow-hidden"
    >
      
      <h2 className="text-xl md:text-2xl font-bold text-slate-200 mb-8 leading-snug relative z-10">
        {question}
      </h2>

      <div className="space-y-3 relative z-10">
        {options.map((option, idx) => (
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
      </div>
    </motion.div>
  );
};

export default QuestionCard;
