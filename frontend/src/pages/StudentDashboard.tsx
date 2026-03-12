import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

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
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const userName = user?.name || 'User';
  const userEmail = user?.email || '';

  const handleLogout = () => {
    logout();
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
        return <CareerPath setActiveTab={setActiveTab} />;
      case 'jobs':
        return <Jobs setActiveTab={setActiveTab} />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings userName={userName} userEmail={userEmail} />;
      default:
        return <Overview userName={userName} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans relative overflow-hidden">

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-15" style={{ background: 'rgba(34,211,238,0.3)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-10" style={{ background: 'rgba(6,182,212,0.3)' }} />
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block relative z-20">
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
