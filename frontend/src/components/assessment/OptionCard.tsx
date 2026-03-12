import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Circle, Check } from 'lucide-react';

interface OptionCardProps {
  option: string;
  index: number;
  selected: boolean;
  correct?: boolean | null; // null if not yet validated
  onSelect: () => void;
  disabled?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({ 
  option, 
  index, 
  selected, 
  correct = null, 
  onSelect, 
  disabled = false 
}) => {
  // Determine styles based on state
  const getStyles = () => {
    if (correct === true) return {
        container: 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]',
        text: 'text-slate-900',
        icon: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
    if (correct === false && selected) return {
        container: 'bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]',
        text: 'text-slate-900',
        icon: 'text-red-400',
        badge: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    if (selected) return {
        container: 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
        text: 'text-slate-900',
        icon: 'text-indigo-400',
        badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    };
    return {
        container: 'bg-sky-100/40 border-sky-200/50 hover:bg-sky-100/80 hover:border-sky-300 hover:shadow-lg',
        text: 'text-slate-700 group-hover:text-primary',
        icon: 'text-slate-500 group-hover:text-indigo-400',
        badge: 'bg-sky-100 text-slate-500 border-sky-200 group-hover:border-sky-300 group-hover:text-slate-700'
    };
  };

  const styles = getStyles();

  return (
    <motion.button
      layout
      whileHover={!disabled ? { scale: 1.01, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onSelect}
      disabled={disabled}
      className={`
        w-full p-4 md:p-5 rounded-xl border transition-all duration-300 
        flex items-center gap-4 text-left group relative overflow-hidden
        ${styles.container}
        ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
      `}
    >
      {/* Selection Indicator (Radio) */}
      <div className={`
        flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
        ${selected ? 'border-indigo-500 bg-indigo-500' : 'border-sky-300 group-hover:border-indigo-400'}
        ${correct === true ? '!border-emerald-500 !bg-emerald-500' : ''}
        ${correct === false && selected ? '!border-red-500 !bg-red-500' : ''}
      `}>
        {selected || correct !== null ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                {correct === false ? <XCircle className="w-4 h-4 text-slate-900" /> : <Check className="w-4 h-4 text-slate-900" />}
            </motion.div>
        ) : null}
      </div>

      {/* Content */}
      <div className="flex-1 z-10">
        <span className={`text-base md:text-lg font-medium transition-colors duration-200 ${styles.text}`}>
          {option}
        </span>
      </div>

      {/* Option Letter Badge (A, B, C...) */}
      <div className={`
        w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-bold transition-all duration-300
        ${styles.badge}
      `}>
        {String.fromCharCode(65 + index)}
      </div>

      {/* Subtle Gradient Glow for Selected State */}
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
      )}
    </motion.button>
  );
};

export default OptionCard;


