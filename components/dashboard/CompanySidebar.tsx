import React from 'react';
import { 
  LayoutDashboard, FileText, Users, MessageSquare, Briefcase, 
  Settings, LogOut, ChevronLeft, ChevronRight, Building
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

const CompanySidebar: React.FC<SidebarProps> = ({ 
  activeTab, setActiveTab, handleLogout, isCollapsed, setIsCollapsed 
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'post-job', label: 'Post a Job', icon: Briefcase },
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
      className="h-screen bg-[#0F172A] border-r border-slate-800 flex flex-col fixed left-0 top-0 z-50 shadow-xl"
    >
      {/* Logo Section */}
      <div className={`flex items-center h-20 px-6 border-b border-slate-800/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
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
              <span className="font-bold text-lg text-white tracking-tight">
                4AM <span className="text-purple-400">Business</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Company Edition</span>
            </motion.div>
          )}
        </div>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
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
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/5 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)] border border-purple-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                } 
                ${isCollapsed ? 'justify-center' : 'space-x-3'}
              `}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              )}
              
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-purple-400' : 'group-hover:text-slate-200'} transition-colors`} />
              
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              )}

              {/* Hover Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 bg-purple-500/5 blur-xl -z-10" />
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

      {/* Bottom Section (Logout) */}
      <div className="p-4 border-t border-slate-800/50 bg-[#0B1120]/50">
        {!isCollapsed ? (
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
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

export default CompanySidebar;
