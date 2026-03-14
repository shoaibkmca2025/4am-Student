import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Bell, User, ChevronDown, Menu, X, Sun, Moon, HelpCircle,
  ExternalLink, Mail, FileText, MessageCircle, LayoutDashboard,
  Code, TrendingUp, Briefcase, Award, MessageSquare, CreditCard, Settings, Users, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementService, notificationService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  userName: string;
  userRole?: 'student' | 'company';
  setActiveTab: (tab: string) => void;
  handleLogout: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'page' | 'job' | 'mentor' | 'skill';
  subtitle?: string;
  icon: React.ElementType;
  action: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, userName, userRole = 'student', setActiveTab, handleLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await achievementService.get();
        if (data) {
          setLevel(data.level);
          setXp(data.xp);
        }
      } catch (error) {
        console.error("Failed to fetch user stats for header", error);
        setLevel(1);
        setXp(0);
      }
    };

    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll();
        setNotifications(data.notifications ?? []);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    };

    fetchStats();
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!showNotifications) return;

    const closeNotifications = () => setShowNotifications(false);

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!notificationPanelRef.current?.contains(target)) {
        closeNotifications();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNotifications();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', closeNotifications, { passive: true });
    window.addEventListener('resize', closeNotifications);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', closeNotifications);
      window.removeEventListener('resize', closeNotifications);
    };
  }, [showNotifications]);

  const handleNotificationClick = async (id: string) => {
    try {
      await notificationService.markRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const studentSearchData: SearchResult[] = [
    { id: 'overview', title: 'Overview', type: 'page', subtitle: 'Dashboard Home', icon: LayoutDashboard, action: () => setActiveTab('overview') },
    { id: 'resume', title: 'Resume Builder', type: 'page', subtitle: 'Create your resume', icon: FileText, action: () => setActiveTab('resume') },
    { id: 'interview', title: 'Mock Interview', type: 'page', subtitle: 'Practice interviews', icon: MessageSquare, action: () => setActiveTab('interview') },
    { id: 'skills', title: 'Skill Tests', type: 'page', subtitle: 'Assess your skills', icon: Code, action: () => setActiveTab('skills') },
    { id: 'career', title: 'Career Path', type: 'page', subtitle: 'Plan your career', icon: TrendingUp, action: () => setActiveTab('career') },
    { id: 'jobs', title: 'Job Matches', type: 'page', subtitle: 'Find jobs', icon: Briefcase, action: () => setActiveTab('jobs') },
    { id: 'achievements', title: 'Achievements', type: 'page', subtitle: 'View badges', icon: Award, action: () => setActiveTab('achievements') },
    { id: 'settings', title: 'Settings', type: 'page', subtitle: 'Account preferences', icon: Settings, action: () => setActiveTab('settings') },
    { id: 'billing', title: 'Billing', type: 'page', subtitle: 'Manage subscription', icon: CreditCard, action: () => setActiveTab('settings') },
  ];

  const companySearchData: SearchResult[] = [
    { id: 'overview', title: 'Overview', type: 'page', subtitle: 'Dashboard Home', icon: LayoutDashboard, action: () => setActiveTab('overview') },
    { id: 'post-job', title: 'Post a Job', type: 'page', subtitle: 'Create new listing', icon: Briefcase, action: () => setActiveTab('post-job') },
    { id: 'admin-skill-tests', title: 'Add Assessments', type: 'page', subtitle: 'Manage skill tests', icon: Code, action: () => setActiveTab('admin-skill-tests') },
    { id: 'candidates', title: 'Candidates', type: 'page', subtitle: 'Search talent', icon: Users, action: () => setActiveTab('candidates') },
    { id: 'interviews', title: 'Interviews', type: 'page', subtitle: 'Schedule & manage', icon: MessageSquare, action: () => setActiveTab('interviews') },
    { id: 'profile', title: 'Company Profile', type: 'page', subtitle: 'Branding & info', icon: Building, action: () => setActiveTab('profile') },
    { id: 'settings', title: 'Settings', type: 'page', subtitle: 'Account preferences', icon: Settings, action: () => setActiveTab('settings') },
  ];

  const searchData = userRole === 'company' ? companySearchData : studentSearchData;

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.subtitle?.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-xl h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300 bg-white/70 dark:bg-slate-900/70 border-b border-black/5 dark:border-white/5">

        {/* Mobile Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-400 hover:text-cyan-400 rounded-lg transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Smart Search Bar */}
        <div className={`relative flex items-center transition-all duration-300 ${isSearchActive ? 'w-full lg:w-96' : 'w-auto lg:w-96'}`}>
          <div className="absolute left-3 text-gray-500 pointer-events-none z-10">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, skills, mentors..."
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none transition-all ${isSearchActive ? 'opacity-100 w-full' : 'hidden lg:block opacity-100 w-full'
              }`}
            style={{ background: theme === 'dark' ? 'rgba(34,211,238,0.05)' : 'rgba(0,0,0,0.05)', border: '1px solid rgba(34,211,238,0.1)' }}
            onFocus={(e) => { setIsSearchActive(true); e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34,211,238,0.08)'; }}
            onBlur={(e) => { setTimeout(() => setIsSearchActive(false), 200); e.currentTarget.style.borderColor = 'rgba(34,211,238,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
          />
          <button
            className={`lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white ${isSearchActive ? 'hidden' : 'block'}`}
            onClick={() => setIsSearchActive(!isSearchActive)}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Search Suggestions Dropdown */}
          <div className={`absolute top-full left-0 right-0 mt-2 backdrop-blur-xl rounded-lg shadow-2xl p-2 z-50 transform origin-top transition-all duration-200 ${isSearchActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}
            style={{ background: theme === 'dark' ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)', border: '1px solid rgba(34,211,238,0.15)' }}>
            {searchQuery === '' ? (
              <div className="px-3 py-4 text-center text-gray-500">
                <p className="text-xs font-medium">Start typing to search pages...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <p className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Results</p>
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      result.action();
                      setIsSearchActive(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md transition-colors flex items-center gap-3 group"
                    style={{ background: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; e.currentTarget.style.color = theme === 'dark' ? '#fff' : '#0f172a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme === 'dark' ? '#9ca3af' : '#4b5563'; }}
                  >
                    <div className="p-1.5 rounded-md" style={{ background: 'rgba(34,211,238,0.1)' }}>
                      <result.icon className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{result.title}</p>
                      {result.subtitle && <p className="text-xs text-gray-500">{result.subtitle}</p>}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-3 py-4 text-center text-gray-500">
                <p className="text-sm">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">

          {/* Help Center */}
          <button
            onClick={() => setShowHelp(true)}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-cyan-400 transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-amber-400 transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationPanelRef}>
            <button
              className="relative flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-cyan-400 transition-colors"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(34,211,238,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
              )}
            </button>

            {showNotifications && (
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setShowNotifications(false)}
                className="fixed inset-0 z-40 bg-transparent cursor-default"
              />
            )}

            {/* Notification Dropdown */}
            <div className={`absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-1rem))] rounded-lg shadow-xl transition-all duration-200 z-50 overflow-hidden bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 ${showNotifications ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
              <div className="flex items-center justify-between p-3 border-b border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h4>
                {notifications.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      notificationService.markAllRead().then(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))));
                      setShowNotifications(false);
                    }}
                    className="text-xs hover:underline text-primary"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <button
                      key={notification._id}
                      onClick={() => {
                        handleNotificationClick(notification._id);
                        setShowNotifications(false);
                      }}
                      className={`w-full text-left p-3 cursor-pointer transition-colors border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 ${notification.read ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notification.type === 'success' ? 'bg-emerald-500' : notification.type === 'error' ? 'bg-red-500' : notification.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{notification.message}</p>
                          <p className="text-[10px] text-gray-500 mt-1.5">{new Date(notification.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-600">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-xs">No new notifications</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative group ml-2 pl-4" style={{ borderLeft: '1px solid rgba(34,211,238,0.1)' }}>
            <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden" style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <User className="w-4 h-4 text-slate-700 dark:text-gray-400" />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">{userName}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(34,211,238,0.1)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(xp / 1000) * 100}%`, background: 'var(--primary)' }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-700 dark:text-gray-500 font-medium">Lvl {level}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden md:block group-hover:rotate-180 transition-transform duration-200" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10">
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md transition-colors hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md transition-colors hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                >
                  Billing
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md transition-colors hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                >
                  Settings
                </button>
                <div className="h-px my-1" style={{ background: 'rgba(34,211,238,0.1)' }} />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg overflow-hidden flex flex-col shadow-2xl rounded-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <div className="p-6 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Help Center
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">How can we assist you today?</p>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-2 rounded-full text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                  style={{ background: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-dim)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: FileText, title: 'Documentation', desc: 'Browse guides and tutorials', color: '#22d3ee' },
                    { icon: MessageCircle, title: 'Live Chat', desc: 'Talk to our support team', color: '#34d399' },
                    { icon: Mail, title: 'Email Support', desc: 'Get help via email', color: '#a78bfa' },
                    { icon: ExternalLink, title: 'Community', desc: 'Join our student forum', color: '#fbbf24' },
                  ].map((item) => (
                    <button key={item.title} className="p-4 rounded-xl text-left group transition-all bg-slate-50 dark:bg-slate-800 border border-black/5 dark:border-white/5 hover:border-black/20 dark:hover:border-white/20"
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform" style={{ background: `${item.color}15` }}>
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-4" style={{ borderTop: '1px solid rgba(34,211,238,0.1)' }}>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Frequently Asked Questions</h4>
                  <div className="space-y-2">
                    {[
                      '• How do I reset my password?',
                      '• Can I download my resume as Word doc?',
                      '• How is the skill score calculated?',
                    ].map((q) => (
                      <button key={q} className="w-full text-left text-sm text-gray-500 transition-colors py-1"
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#22d3ee'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#6b7280'; }}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-end" style={{ borderTop: '1px solid var(--border)', background: 'rgba(15,23,42,0.5)' }}>
                <button
                  onClick={() => setShowHelp(false)}
                  className="btn-primary px-6 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
