import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from './StudentDashboard';
import CompanyDashboard from './CompanyDashboard';

const Dashboard: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const userRole = localStorage.getItem('userRole');
    setRole(userRole || 'student'); // Default to student if no role found
  }, [navigate]);

  if (!role) {
    return null; // or a loading spinner
  }

  return role === 'company' ? <CompanyDashboard /> : <StudentDashboard />;
};

export default Dashboard;
