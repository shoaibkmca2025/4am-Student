import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const weeklyData = [
  { name: 'Mon', score: 65 },
  { name: 'Tue', score: 68 },
  { name: 'Wed', score: 75 },
  { name: 'Thu', score: 72 },
  { name: 'Fri', score: 80 },
  { name: 'Sat', score: 85 },
  { name: 'Sun', score: 88 },
];

const monthlyData = [
  { name: 'Week 1', score: 60 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 68 },
  { name: 'Week 4', score: 85 },
];

const yearlyData = [
  { name: 'Jan', score: 45 },
  { name: 'Feb', score: 52 },
  { name: 'Mar', score: 58 },
  { name: 'Apr', score: 65 },
  { name: 'May', score: 70 },
  { name: 'Jun', score: 85 },
  { name: 'Jul', score: 82 },
  { name: 'Aug', score: 88 },
  { name: 'Sep', score: 92 },
  { name: 'Oct', score: 95 },
  { name: 'Nov', score: 98 },
  { name: 'Dec', score: 100 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm flex items-center gap-2">
          Score: {payload[0].value}
          <span className="text-emerald-400 text-[10px] flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +2.5%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const InteractiveAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Week');

  const getData = () => {
    switch (timeRange) {
      case 'Week': return weeklyData;
      case 'Month': return monthlyData;
      case 'Year': return yearlyData;
      default: return weeklyData;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="saas-card p-6 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Career Growth
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            Readiness score over time 
            <span className="text-emerald-400 flex items-center bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Top 10%
            </span>
          </p>
        </div>
        
        <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800">
          {['Week', 'Month', 'Year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-slate-700 text-white shadow-sm ring-1 ring-slate-600' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={getData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickCount={6}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area 
              type="monotone" 
              dataKey="score" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorScore)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default InteractiveAnalytics;
