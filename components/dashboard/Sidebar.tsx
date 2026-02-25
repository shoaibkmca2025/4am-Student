import React from 'react';
import { 
  LayoutDashboard, FileText, Code, MessageSquare, TrendingUp, 
  Briefcase, Settings, LogOut, ChevronLeft, ChevronRight, Award,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '../../4am logo.jpeg';

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

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-slate-950/60 backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-50 shadow-2xl"
    >
      {/* Logo Section */}
      <div className={`flex items-center h-20 px-6 border-b border-white/5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img src={logoImage} alt="Logo" className="relative w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" />
          </div>
          
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-white tracking-tight">
                4AM <span className="text-indigo-400">Coach</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Student Edition</span>
            </motion.div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-all"
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
                ${isActive 
                  ? 'bg-white/10 backdrop-blur-md text-white shadow-[0_4px_20px_-2px_rgba(99,102,241,0.2)] border border-white/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                } 
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
              )}
              
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'group-hover:text-slate-200'} transition-colors`} />
              
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              )}

              {/* Hover Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 bg-indigo-500/5 blur-xl -z-10" />
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-slate-700 z-50">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section (XP/Profile/Logout) */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0B1120]/50">
        {!isCollapsed ? (
          <div className="space-y-4">
            {/* Mini XP Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> Lvl 5</span>
                <span>2,450 / 3,000 XP</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                />
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogout}
            className="w-full flex justify-center p-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Expand Button (Mobile/When Collapsed) */}
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mb-4 p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </motion.aside>
  );
};

export default Sidebar;
