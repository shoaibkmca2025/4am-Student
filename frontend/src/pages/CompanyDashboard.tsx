import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Import Dashboard Components
import CompanySidebar from '../components/dashboard/CompanySidebar';
import Header from '../components/dashboard/Header';
import CompanyOverview from '../components/dashboard/CompanyOverview';
import Settings from '../components/dashboard/Settings';
import PostJob from '../components/dashboard/PostJob';
import ManageApplications from '../components/dashboard/ManageApplications';

const CompanyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const userName = user?.name || 'Company User';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CompanyOverview userName={userName} setActiveTab={setActiveTab} />;
      case 'post-job':
        return <PostJob />;
      case 'candidates':
        return <ManageApplications />;
      case 'settings':
        return <Settings userName={userName} userEmail={user?.email || ''} />;
      default:
        return <CompanyOverview userName={userName} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-900 font-sans selection:bg-primary/30">

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
              className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-40 lg:hidden"
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
                setIsCollapsed={() => { }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'
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

