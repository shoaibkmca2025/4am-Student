import React from 'react';
import { 
  LayoutDashboard, Users, MessageSquare, Briefcase, 
  Settings, LogOut, ChevronLeft, ChevronRight, Building, Code
} from 'lucide-react';
import { motion } from 'framer-motion';
import logoImage from '../../4am-logo.jpeg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const CompanySidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, handleLogout, isCollapsed, setIsCollapsed 
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post a Job', icon: Briefcase },
    { id: 'admin-skill-tests', label: 'Add Assessments', icon: Code },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: MessageSquare },
    { id: 'profile', label: 'Company Profile', icon: Building },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside 
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen backdrop-blur-xl flex flex-col fixed left-0 top-0 z-50 shadow-2xl bg-white/85 dark:bg-slate-900/85 border-r border-black/5 dark:border-white/5"
    >
      {/* Logo Section */}
      <div className={`flex items-center h-20 px-6 border-b border-black/5 dark:border-white/5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img src={logoImage} alt="Logo" className="relative w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" />
          </div>
          
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                4AM <span className="text-purple-400">Business</span>
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Company Edition</span>
            </motion.div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-cyan-400 transition-all"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
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
                relative w-full flex items-center p-3 rounded-xl transition-all duration-200 group overflow-hidden
                ${isActive 
                  ? 'bg-primary/10 border-primary/20' 
                  : 'border-transparent hover:bg-primary/5'
                } 
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" style={{ background: '#22d3ee', boxShadow: '0 0 15px rgba(34,211,238,0.6)' }} />
              )}
              
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-slate-500 group-hover:text-primary transition-colors'}`} />
              
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary'}`}>
                  {item.label}
                </span>
              )}

              {/* Hover Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 bg-purple-500/5 blur-xl -z-10" />
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1.5 text-slate-900 dark:text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50 bg-white dark:bg-slate-800 border border-black/10 dark:border-primary/20">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 rotate-45 bg-white dark:bg-slate-800 border-l border-b border-black/10 dark:border-primary/20" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Section (Logout) */}
      <div className="p-4 border-t border-black/5 dark:border-white/5 bg-slate-100 dark:bg-slate-800/30">
        {!isCollapsed ? (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            className="w-full flex justify-center p-2 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Expand Button (Mobile/When Collapsed) */}
      {isCollapsed && (
        <button 
          onClick={() => setIsCollapsed(false)}
          className="mx-auto mb-4 p-2 rounded-lg text-gray-500 transition-colors"
          style={{ background: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; e.currentTarget.style.color = '#22d3ee'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </motion.aside>
  );
};

export default CompanySidebar;


