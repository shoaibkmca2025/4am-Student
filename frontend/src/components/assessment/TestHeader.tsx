import React, { useState, useEffect } from 'react';
import { Timer, ArrowLeft, MoreVertical, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestHeaderProps {
  title: string;
  duration: string;
  totalQuestions: number;
  currentQuestion: number;
  onExit: () => void;
}

const TestHeader: React.FC<TestHeaderProps> = ({ 
  title, 
  duration, 
  totalQuestions, 
  currentQuestion, 
  onExit 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration); 
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(((currentQuestion + 1) / totalQuestions) * 100);
  }, [currentQuestion, totalQuestions]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-sky-200 z-50 px-4 md:px-8 h-16 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-4">
        <button 
          onClick={onExit}
          className="p-2 hover:bg-sky-100 rounded-lg text-slate-600 hover:text-primary transition-all group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-slate-800 font-bold text-lg hidden md:block tracking-tight">{title}</h1>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 md:hidden">
            <span className="text-indigo-400">Q{currentQuestion + 1}</span>
            <span className="text-slate-600">/</span>
            <span>{totalQuestions}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-4 hidden md:block">
        <div className="flex justify-between text-xs text-slate-600 mb-2 font-medium tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
            Progress
          </span>
          <span className="text-indigo-300">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-sky-100/50 rounded-full overflow-hidden border border-sky-200/50">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 bg-sky-100/80 px-4 py-2 rounded-lg border border-sky-200 shadow-sm">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-sm opacity-20 animate-pulse"></div>
            <Timer className="w-4 h-4 text-indigo-400 relative z-10" />
          </div>
          <span className="text-sm font-mono font-bold text-slate-800 tracking-wider">{timeLeft}</span>
        </div>
        <button className="p-2 hover:bg-sky-100 rounded-lg text-slate-600 hover:text-primary transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default TestHeader;


