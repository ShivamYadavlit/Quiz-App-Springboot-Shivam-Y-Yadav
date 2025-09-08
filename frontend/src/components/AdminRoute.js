import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import AdminLogin from '../pages/AdminLogin';

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAdminToken();
  }, []);

  const verifyAdminToken = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      await adminAPI.verifyAdminToken();
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Admin token verification failed:', error);
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return children;
};

export default AdminRoute;
