import React, { useState, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface InteractiveAnalyticsProps {
  completedTests?: any[];
}

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildChartData(completedTests: any[], range: string) {
  if (!completedTests.length) return [];

  const now = new Date();
  const entries = completedTests
    .map(t => ({
      date: new Date(t.completedAt || t.updatedAt || t.createdAt),
      score: parseInt(String(t.score)) || 0,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  if (range === 'Week') {
    // Last 7 days
    const buckets: Record<string, number[]> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = dayNames[d.getDay()];
      buckets[key] = [];
    }
    entries.forEach(e => {
      const diff = Math.floor((now.getTime() - e.date.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 7) {
        const key = dayNames[e.date.getDay()];
        if (buckets[key]) buckets[key].push(e.score);
      }
    });
    return Object.entries(buckets).map(([name, scores]) => ({
      name,
      score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    }));
  }

  if (range === 'Month') {
    // Last 4 weeks
    const buckets: { name: string; scores: number[] }[] = [];
    for (let w = 3; w >= 0; w--) {
      const start = new Date(now);
      start.setDate(now.getDate() - (w + 1) * 7);
      const end = new Date(now);
      end.setDate(now.getDate() - w * 7);
      buckets.push({ name: `Week ${4 - w}`, scores: [] });
      entries.forEach(e => {
        if (e.date >= start && e.date < end) {
          buckets[buckets.length - 1].scores.push(e.score);
        }
      });
    }
    return buckets.map(b => ({
      name: b.name,
      score: b.scores.length ? Math.round(b.scores.reduce((a, c) => a + c, 0) / b.scores.length) : 0,
    }));
  }

  // Year — last 12 months
  const buckets: { name: string; scores: number[] }[] = [];
  for (let m = 11; m >= 0; m--) {
    const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
    buckets.push({ name: monthNames[d.getMonth()], scores: [] });
    entries.forEach(e => {
      if (e.date.getFullYear() === d.getFullYear() && e.date.getMonth() === d.getMonth()) {
        buckets[buckets.length - 1].scores.push(e.score);
      }
    });
  }
  return buckets.map(b => ({
    name: b.name,
    score: b.scores.length ? Math.round(b.scores.reduce((a, c) => a + c, 0) / b.scores.length) : 0,
  }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-sky-200 p-3 rounded-lg shadow-xl">
        <p className="text-slate-600 text-xs mb-1">{label}</p>
        <p className="text-slate-900 font-bold text-sm flex items-center gap-2">
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const InteractiveAnalytics: React.FC<InteractiveAnalyticsProps> = ({ completedTests = [] }) => {
  const [timeRange, setTimeRange] = useState('Week');

  const data = useMemo(() => buildChartData(completedTests, timeRange), [completedTests, timeRange]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/60 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl p-5 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Career Growth
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">Readiness score over time</p>
        </div>
        
        <div className="flex bg-white/50 rounded-lg p-1 border border-sky-200">
          {['Week', 'Month', 'Year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-sky-200 text-slate-900 shadow-sm ring-1 ring-sky-300' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-sky-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full relative">
        {data.every(d => d.score === 0) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
             <div className="w-12 h-12 bg-sky-100/50 rounded-full flex items-center justify-center mb-3 border border-sky-200">
                <TrendingUp className="w-6 h-6 text-slate-500" />
             </div>
             <h4 className="text-slate-800 font-bold text-sm">No Activity Data</h4>
             <p className="text-slate-600 text-xs mt-1 max-w-[200px]">
                Complete assessments and track your progress to see career growth analytics.
             </p>
          </div>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
        )}
      </div>
    </motion.div>
  );
};

export default InteractiveAnalytics;


