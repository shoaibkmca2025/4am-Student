import React from 'react';
import {
  LayoutDashboard, FileText, Code, MessageSquare, TrendingUp,
  Briefcase, Settings, LogOut, ChevronLeft, ChevronRight, Award,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '../../4am-logo.jpeg';
import { calculateUserLevel } from '../../services/userData';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab, setActiveTab, handleLogout, isCollapsed, setIsCollapsed
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'resume', label: 'Resume Builder', icon: FileText },
    { id: 'interview', label: 'Mock Interview', icon: MessageSquare },
    { id: 'skills', label: 'Skill Tests', icon: Code },
    { id: 'career', label: 'Career Path', icon: TrendingUp },
    { id: 'jobs', label: 'Job Matches', icon: Briefcase },
    { id: 'achievements', label: 'Achievements', icon: Award },
  ];

  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(0);
  const [maxXp, setMaxXp] = React.useState(1000);

  React.useEffect(() => {
    const { level, xp } = calculateUserLevel();
    setLevel(level);
    setXp(xp);
    setMaxXp(1000);
  }, []);

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen backdrop-blur-xl flex flex-col fixed left-0 top-0 z-50 shadow-2xl bg-white/85 dark:bg-[#0a0a0a]/85 border-r border-black/5 dark:border-white/5"
    >
      {/* Logo Section */}
      <div className={`flex items-center h-20 px-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`} style={{ borderBottom: '1px solid rgba(0,245,255,0.08)' }}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="relative group">
            <div className="absolute -inset-0.5 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" style={{ background: 'linear-gradient(to right, #00f5ff, #06b6d4)' }} />
            <img src={logoImage} alt="Logo" className="relative w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" />
          </div>

          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                4AM <span style={{ color: '#00f5ff' }}>Coach</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Student Edition</span>
            </motion.div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 transition-all"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,245,255,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`
                relative w-full flex items-center p-3 rounded-xl transition-all duration-300 group overflow-hidden
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
                ${isActive ? 'bg-primary/10 border-primary/20' : 'border-transparent hover:bg-primary/5'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ background: '#00f5ff', boxShadow: '0 0 15px rgba(0,245,255,0.8)' }} />
              )}

              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary transition-colors'}`} />

              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`}>
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 text-slate-900 dark:text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50 bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-primary/20">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-white dark:bg-[#0a0a0a] border-l border-b border-black/10 dark:border-primary/20" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section (XP/Profile/Logout) */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 bg-slate-100 dark:bg-black/30">
        {!isCollapsed ? (
          <div className="space-y-4">
            {/* Mini XP Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-gray-400">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Lvl {level}</span>
                <span>{xp} / {maxXp} XP</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,245,255,0.1)' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / maxXp) * 100}%` }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #f59e0b, #f97316)', boxShadow: '0 0 10px rgba(251,191,36,0.5)' }}
                />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex justify-center p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand Button (When Collapsed) */}
      {isCollapsed && (
        <button
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mb-4 p-2 rounded-lg text-gray-500 transition-colors"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,245,255,0.08)'; e.currentTarget.style.color = '#00f5ff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </motion.aside>
  );
};

export default Sidebar;
