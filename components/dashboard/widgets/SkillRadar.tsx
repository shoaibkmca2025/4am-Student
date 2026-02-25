import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

const data = [
  { subject: 'React', A: 140, fullMark: 150 },
  { subject: 'Node.js', A: 130, fullMark: 150 },
  { subject: 'Sys Design', A: 110, fullMark: 150 },
  { subject: 'Algorithms', A: 125, fullMark: 150 },
  { subject: 'Python', A: 115, fullMark: 150 },
  { subject: 'Soft Skills', A: 135, fullMark: 150 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-200 font-bold text-sm mb-1">{label}</p>
        <p className="text-indigo-400 text-xs font-medium">
          Score: <span className="text-white">{payload[0].value}</span> / 150
        </p>
      </div>
    );
  }
  return null;
};

const SkillRadar: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="saas-card p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-400" />
          Skill Analysis
        </h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
          Details
        </button>
      </div>

      <div className="flex-1 min-h-[250px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }} 
            />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
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
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default SkillRadar;
