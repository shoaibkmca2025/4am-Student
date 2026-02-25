import React, { useState, useEffect } from 'react';
import { 
  Search, Bell, User, ChevronDown, Menu, X, Sun, Moon, HelpCircle,
  ExternalLink, Mail, FileText, MessageCircle, LayoutDashboard, 
  Code, TrendingUp, Briefcase, Award, MessageSquare, CreditCard, Settings, Users, Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  // Mock Data for Search
  const studentSearchData: SearchResult[] = [
    // Pages
    { id: 'overview', title: 'Overview', type: 'page', subtitle: 'Dashboard Home', icon: LayoutDashboard, action: () => setActiveTab('overview') },
    { id: 'resume', title: 'Resume Builder', type: 'page', subtitle: 'Create your resume', icon: FileText, action: () => setActiveTab('resume') },
    { id: 'interview', title: 'Mock Interview', type: 'page', subtitle: 'Practice interviews', icon: MessageSquare, action: () => setActiveTab('interview') },
    { id: 'skills', title: 'Skill Tests', type: 'page', subtitle: 'Assess your skills', icon: Code, action: () => setActiveTab('skills') },
    { id: 'career', title: 'Career Path', type: 'page', subtitle: 'Plan your career', icon: TrendingUp, action: () => setActiveTab('career') },
    { id: 'jobs', title: 'Job Matches', type: 'page', subtitle: 'Find jobs', icon: Briefcase, action: () => setActiveTab('jobs') },
    { id: 'achievements', title: 'Achievements', type: 'page', subtitle: 'View badges', icon: Award, action: () => setActiveTab('achievements') },
    { id: 'settings', title: 'Settings', type: 'page', subtitle: 'Account preferences', icon: Settings, action: () => setActiveTab('settings') },
    { id: 'billing', title: 'Billing', type: 'page', subtitle: 'Manage subscription', icon: CreditCard, action: () => setActiveTab('settings') },
    
    // Mock Jobs (Simulated)
    { id: 'job-1', title: 'Frontend Developer', type: 'job', subtitle: 'Google - Remote', icon: Briefcase, action: () => setActiveTab('jobs') },
    { id: 'job-2', title: 'React Engineer', type: 'job', subtitle: 'Meta - London', icon: Briefcase, action: () => setActiveTab('jobs') },
    { id: 'job-3', title: 'UX Designer', type: 'job', subtitle: 'Airbnb - NYC', icon: Briefcase, action: () => setActiveTab('jobs') },

    // Mock Skills
    { id: 'skill-1', title: 'React.js', type: 'skill', subtitle: 'Advanced Assessment', icon: Code, action: () => setActiveTab('skills') },
    { id: 'skill-2', title: 'TypeScript', type: 'skill', subtitle: 'Intermediate Assessment', icon: Code, action: () => setActiveTab('skills') },
  ];

  const companySearchData: SearchResult[] = [
    // Pages
    { id: 'overview', title: 'Overview', type: 'page', subtitle: 'Dashboard Home', icon: LayoutDashboard, action: () => setActiveTab('overview') },
    { id: 'post-job', title: 'Post a Job', type: 'page', subtitle: 'Create new listing', icon: Briefcase, action: () => setActiveTab('post-job') },
    { id: 'candidates', title: 'Candidates', type: 'page', subtitle: 'Search talent', icon: Users, action: () => setActiveTab('candidates') },
    { id: 'interviews', title: 'Interviews', type: 'page', subtitle: 'Schedule & manage', icon: MessageSquare, action: () => setActiveTab('interviews') },
    { id: 'profile', title: 'Company Profile', type: 'page', subtitle: 'Branding & info', icon: Building, action: () => setActiveTab('profile') }, // Building needs import but let's check if it is imported
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

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      // Note: Since the app is built with slate-900 as default, we might need to handle this more globally
      // For now, we'll toggle the state to reflect user choice
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300">
      
      {/* Mobile Toggle & Logo */}
      <div className="flex items-center lg:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Smart Search Bar */}
      <div className={`relative flex items-center transition-all duration-300 ${isSearchActive ? 'w-full lg:w-96' : 'w-auto lg:w-96'}`}>
        <div className="absolute left-3 text-slate-500 pointer-events-none z-10">
          <Search className="w-4 h-4" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search jobs, skills, mentors..." 
          className={`saas-input w-full pl-10 ${
            isSearchActive ? 'opacity-100 w-full' : 'hidden lg:block opacity-100 w-full'
          }`}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
        />
        <button 
          className={`lg:hidden p-2 text-slate-400 hover:text-slate-100 ${isSearchActive ? 'hidden' : 'block'}`}
          onClick={() => setIsSearchActive(!isSearchActive)}
        >
          <Search className="w-5 h-5" />
        </button>
        
        {/* Search Suggestions Dropdown */}
        <div className={`absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-2 z-50 transform origin-top transition-all duration-200 ${isSearchActive ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
            {searchQuery === '' ? (
              <>
                <p className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Searches</p>
                <button 
                  onClick={() => setSearchQuery('React Developer Jobs')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"
                >
                  <Search className="w-3 h-3" /> React Developer Jobs
                </button>
                <button 
                  onClick={() => setSearchQuery('Resume Tips')}
                  className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2"
                >
                   <Search className="w-3 h-3" /> Resume Tips
                </button>
              </>
            ) : searchResults.length > 0 ? (
              <>
                <p className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Results</p>
                {searchResults.map((result) => (
                  <button 
                    key={result.id}
                    onClick={() => {
                      result.action();
                      setIsSearchActive(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-3 group"
                  >
                    <div className="p-1.5 rounded-md bg-slate-800 group-hover:bg-slate-700 transition-colors">
                      <result.icon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-200">{result.title}</p>
                      {result.subtitle && <p className="text-xs text-slate-500">{result.subtitle}</p>}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-3 py-4 text-center text-slate-500">
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
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-slate-400 hover:text-primary hover:bg-slate-800 transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="hidden sm:flex items-center justify-center w-9 h-9 rounded-md text-slate-400 hover:text-warning hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-slate-900"></span>
          
          {/* Notification Dropdown (Hover) */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
            <div className="p-3 border-b border-slate-700 bg-slate-800/50">
              <h4 className="text-sm font-semibold text-slate-200">Notifications</h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <div className="p-3 border-b border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer">
                <p className="text-sm text-slate-300">New Job Match!</p>
                <p className="text-xs text-slate-500 mt-1">Senior React Dev at Linear matches your profile.</p>
              </div>
              <div className="p-3 hover:bg-slate-800 transition-colors cursor-pointer">
                <p className="text-sm text-slate-300">Daily Streak</p>
                <p className="text-xs text-slate-500 mt-1">You're on a 4-day streak! Keep it up.</p>
              </div>
            </div>
          </div>
        </button>

        {/* User Profile */}
        <div className="relative group ml-2 pl-4 border-l border-slate-800">
          <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                <User className="w-4 h-4 text-slate-400" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-slate-200 leading-none">{userName}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-primary"></div>
                </div>
                <p className="text-[10px] text-slate-500">Lvl 5</p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 hidden md:block group-hover:rotate-180 transition-transform duration-200" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
            <div className="p-1.5 space-y-0.5">
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                Billing
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
              >
                Settings
              </button>
              <div className="h-px bg-slate-800 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-400" />
                    Help Center
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">How can we assist you today?</p>
                </div>
                <button 
                  onClick={() => setShowHelp(false)}
                  className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/50 transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="font-semibold text-slate-200 mb-1">Documentation</h3>
                    <p className="text-xs text-slate-400">Browse guides and tutorials</p>
                  </button>

                  <button className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-emerald-500/50 transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="font-semibold text-slate-200 mb-1">Live Chat</h3>
                    <p className="text-xs text-slate-400">Talk to our support team</p>
                  </button>

                  <button className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-purple-500/50 transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-slate-200 mb-1">Email Support</h3>
                    <p className="text-xs text-slate-400">Get help via email</p>
                  </button>

                  <button className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-amber-500/50 transition-all text-left group">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <ExternalLink className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-slate-200 mb-1">Community</h3>
                    <p className="text-xs text-slate-400">Join our student forum</p>
                  </button>
                </div>
                
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Frequently Asked Questions</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-sm text-slate-400 hover:text-indigo-400 transition-colors py-1">
                      • How do I reset my password?
                    </button>
                    <button className="w-full text-left text-sm text-slate-400 hover:text-indigo-400 transition-colors py-1">
                      • Can I download my resume as Word doc?
                    </button>
                    <button className="w-full text-left text-sm text-slate-400 hover:text-indigo-400 transition-colors py-1">
                      • How is the skill score calculated?
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex justify-end">
                <button 
                  onClick={() => setShowHelp(false)}
                  className="saas-button-primary"
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
