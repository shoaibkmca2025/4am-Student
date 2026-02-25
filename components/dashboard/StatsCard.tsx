import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import TiltCard from './TiltCard';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: 'primary' | 'secondary' | 'accent' | 'blue' | 'purple' | 'emerald';
  progress?: number;
  tooltip?: string;
  data?: any[]; // For sparkline
  variant?: 'default' | 'circular' | 'chart' | 'gauge' | 'bar';
}

const colorMap = {
  primary: {
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20',
    icon: 'text-indigo-400',
    gradient: 'from-indigo-500/20 to-indigo-500/5',
    stroke: '#818CF8'
  },
  secondary: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20',
    icon: 'text-slate-400',
    gradient: 'from-slate-500/20 to-slate-500/5',
    stroke: '#94A3B8'
  },
  accent: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    gradient: 'from-amber-500/20 to-amber-500/5',
    stroke: '#FBBF24'
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-500/5',
    stroke: '#60A5FA'
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-500/5',
    stroke: '#A78BFA'
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    stroke: '#34D399'
  },
};

const AnimatedNumber = ({ value }: { value: string | number }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  const isPercentage = typeof value === 'string' && value.includes('%');
  const isRatio = typeof value === 'string' && value.includes('/');
  
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const displayValue = useTransform(spring, (current) => {
    if (isRatio) return value; // Don't animate ratios yet
    return isPercentage 
      ? `${Math.round(current)}%` 
      : Math.round(current * 10) / 10; // 1 decimal place if needed
  });

  useEffect(() => {
    if (!isNaN(numericValue)) {
      spring.set(numericValue);
    }
  }, [numericValue, spring]);

  return <motion.span>{displayValue}</motion.span>;
};

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, value, icon: Icon, trend, trendUp, color, progress, tooltip, data, variant = 'default'
}) => {
  // Generate random data if not provided for sparkline effect
  const sparklineData = data || Array.from({ length: 10 }).map((_, i) => ({ value: Math.random() * 100 + (i * 5) }));

  // Helper to get progress percentage
  const getProgress = () => {
    if (progress !== undefined) return progress;
    if (typeof value === 'string') {
        if (value.includes('/')) {
            const [num, den] = value.split('/').map(Number);
            return den ? (num / den) * 100 : 0;
        }
        return parseFloat(value) || 0;
    }
    return Number(value) || 0;
  };

  const currentProgress = getProgress();
  const theme = colorMap[color] || colorMap.primary;

  // Helper for circular progress
  const CircleProgress = ({ value, theme }: { value: number, theme: any }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;
    
    return (
      <div className="relative w-24 h-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-slate-800"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${theme.text}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
           <span className={`text-xl font-bold ${theme.text}`}>
             <AnimatedNumber value={`${value}%`} />
           </span>
        </div>
      </div>
    );
  };

  // Helper for Gauge
  const Gauge = ({ percentage, theme }: { percentage: number, theme: any }) => {
    return (
      <div className="relative w-full h-12 flex items-end justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
         <svg viewBox="0 0 100 50" className="w-24 h-12">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-slate-800" />
            <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeDasharray="126"
                strokeDashoffset={126 - (126 * percentage / 100)}
                className={`transition-all duration-1000 ease-out ${theme.text}`}
            />
          </svg>
      </div>
    )
  }

  return (
    <TiltCard 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 relative overflow-hidden group h-full flex flex-col justify-between hover:shadow-2xl hover:bg-slate-800/60 transition-all duration-300`}
    >
      {/* Background Gradient Splash */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.gradient} rounded-full blur-2xl -mr-10 -mt-10 opacity-30 group-hover:opacity-60 transition-opacity duration-500`} style={{ transform: 'translateZ(-20px)' }}></div>

      <div className="relative z-10 w-full h-full flex flex-col" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${theme.bg} ${theme.text} ring-1 ring-inset ${theme.border} transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 shadow-lg shadow-indigo-500/10`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium border ${trendUp ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} group-hover:scale-105 transition-transform duration-300`}>
              <span>{trend}</span>
              {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </div>
          )}
        </div>

        <div className="space-y-1 flex-1">
            {variant === 'circular' ? (
                <div className="flex flex-col items-center justify-center py-2 group-hover:scale-105 transition-transform duration-300">
                     <CircleProgress value={currentProgress} theme={theme} />
                     <p className="text-sm font-medium text-slate-400 mt-2">{title}</p>
                </div>
            ) : variant === 'gauge' ? (
                <div className="flex flex-col items-center justify-center py-2">
                    <Gauge percentage={currentProgress} theme={theme} />
                    <h3 className="text-2xl font-bold text-slate-200 mt-2">
                      <AnimatedNumber value={value} />
                    </h3>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                </div>
            ) : (
                <>
                  <h3 className="text-3xl font-bold text-slate-200 tracking-tight">
                    <AnimatedNumber value={value} />
                  </h3>
                  <div className="flex items-center space-x-2 group/tooltip cursor-help">
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    {tooltip && <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300 transition-colors" />}
                    
                    {/* Tooltip */}
                    {tooltip && (
                      <div className="absolute left-0 bottom-full mb-2 w-56 p-3 bg-slate-900/95 backdrop-blur-md text-xs text-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none border border-slate-700/50">
                        {tooltip}
                        <div className="absolute left-4 top-full w-2 h-2 bg-slate-900/95 transform rotate-45 border-r border-b border-slate-700/50"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Sparkline Area - Only for chart variant or default with data */}
                  {(variant === 'chart' || (variant === 'default' && data)) && (
                   <div className="h-12 mt-4 -mx-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                      <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={sparklineData}>
                            <defs>
                               <linearGradient id={`color${color}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={theme.stroke} stopOpacity={0.3} />
                                  <stop offset="95%" stopColor={theme.stroke} stopOpacity={0} />
                               </linearGradient>
                            </defs>
                            <Area 
                               type="monotone" 
                               dataKey="value" 
                               stroke={theme.stroke} 
                               strokeWidth={2}
                               fill={`url(#color${color})`} 
                            />
                         </AreaChart>
                      </ResponsiveContainer>
                   </div>
                  )}

                  {/* Progress Bar Variant */}
                  {variant === 'bar' && (
                    <div className="mt-4 relative h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${currentProgress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`absolute top-0 left-0 h-full rounded-full ${theme.bg.replace('bg-', 'bg-').replace('/10', '')}`}
                        style={{ backgroundColor: theme.stroke }}
                      />
                    </div>
                  )}
                </>
            )}
        </div>
      </div>
    </TiltCard>
  );
};

export default StatsCard;