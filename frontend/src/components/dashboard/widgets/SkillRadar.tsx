import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import { Target, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';

interface SkillRadarProps {
  data?: { subject: string; A: number; fullMark: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-sky-200 p-3 rounded-lg shadow-xl z-50">
        <p className="text-slate-800 font-bold text-sm mb-1">{label}</p>
        <p className="text-indigo-400 text-xs font-medium">
          Score: <span className="text-slate-900">{payload[0].value}</span> / 100
        </p>
      </div>
    );
  }
  return null;
};

const SkillRadar: React.FC<SkillRadarProps> = ({ data = [] }) => {
  const hasData = data.length > 0 && data.some(d => d.A > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          Skill Analysis
        </h3>
      </div>

      <div className="flex-1 min-h-[220px] w-full relative mb-4 flex items-center justify-center">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }} 
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="My Skills"
                dataKey="A"
                stroke="#6366F1"
                strokeWidth={2}
                fill="#6366F1"
                fillOpacity={0.2}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-slate-500">
            <Target className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No skill data available</p>
            <p className="text-xs opacity-60">Complete assessments to see analysis</p>
          </div>
        )}
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default SkillRadar;


