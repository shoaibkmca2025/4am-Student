import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import CompanyDashboard from './CompanyDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return user.role === 'company' ? <CompanyDashboard /> : <StudentDashboard />;
};

export default Dashboard;
