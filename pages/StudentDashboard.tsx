import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import Dashboard Components
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import Overview from '../components/dashboard/Overview';
import ResumeBuilder from '../components/dashboard/ResumeBuilder';
import SkillTests from '../components/dashboard/SkillTests';
import MockInterview from '../components/dashboard/MockInterview';
import CareerPath from '../components/dashboard/CareerPath';
import Jobs from '../components/dashboard/Jobs';
import Settings from '../components/dashboard/Settings';
import Achievements from '../components/dashboard/Achievements';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
    const storedName = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
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
        return <Overview userName={userName} setActiveTab={setActiveTab} />;
      case 'resume':
        return <ResumeBuilder />;
      case 'skills':
        return <SkillTests />;
      case 'interview':
        return <MockInterview />;
      case 'career':
        return <CareerPath />;
      case 'jobs':
        return <Jobs />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview userName={userName} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-primary/30">
      
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
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
              <Sidebar 
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

export default StudentDashboard;
