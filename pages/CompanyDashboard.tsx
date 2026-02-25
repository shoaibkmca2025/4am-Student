import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import Dashboard Components
import CompanySidebar from '../components/dashboard/CompanySidebar';
import Header from '../components/dashboard/Header';
import CompanyOverview from '../components/dashboard/CompanyOverview';
import Settings from '../components/dashboard/Settings';

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Company User');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    const storedName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'Company User';
    setUserName(storedName);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CompanyOverview userName={userName} setActiveTab={setActiveTab} />;
      case 'post-job':
        return (
          <div className="saas-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Post a Job</h2>
            <p className="text-slate-400">Job posting form will be available here.</p>
          </div>
        );
      case 'candidates':
        return (
          <div className="saas-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Candidates</h2>
            <p className="text-slate-400">Candidate search and management will be here.</p>
          </div>
        );
      case 'interviews':
        return (
            <div className="saas-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Interviews</h2>
              <p className="text-slate-400">Interview scheduler and management.</p>
            </div>
          );
      case 'profile':
        return (
            <div className="saas-card p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Company Profile</h2>
              <p className="text-slate-400">Edit company details and branding.</p>
            </div>
          );
      case 'settings':
        return <Settings />;
      default:
        return <CompanyOverview userName={userName} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-purple-500/30">
      
      {/* Sidebar */}
      <div className="hidden lg:block">
        <CompanySidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          handleLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed top-0 left-0 bottom-0 z-50 lg:hidden"
            >
              <CompanySidebar 
                activeTab={activeTab} 
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }}
                handleLogout={handleLogout}
                isCollapsed={false}
                setIsCollapsed={() => {}}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div 
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'
        }`}
      >
        <Header 
          toggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
          isSidebarOpen={isMobileSidebarOpen}
          userName={userName}
          userRole="company"
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
