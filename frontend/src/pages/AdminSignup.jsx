import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecretKey: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        adminSecretKey: formData.adminSecretKey,
      };

      await adminAPI.adminRegister(registrationData);
      
      setSuccess('Admin account created successfully! You can now login.');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        adminSecretKey: '',
      });
      
      // Redirect to admin login after 2 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.error || 'Admin registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-blue-600 px-8 py-6">
            <div className="text-center">
              <i className="fas fa-user-plus text-4xl text-white mb-3"></i>
              <h2 className="text-2xl font-bold text-white">Admin Registration</h2>
              <p className="text-blue-100 mt-1">Create Administrative Account</p>
            </div>
          </div>
          
          <div className="px-8 py-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-user mr-2"></i>
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter username"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-envelope mr-2"></i>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-lock mr-2"></i>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter password"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-lock mr-2"></i>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm password"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="adminSecretKey" className="block text-sm font-medium text-gray-700 mb-2">
                  <i className="fas fa-key mr-2"></i>
                  Admin Secret Key
                </label>
                <input
                  id="adminSecretKey"
                  name="adminSecretKey"
                  type="password"
                  required
                  value={formData.adminSecretKey}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter admin secret key"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  <i className="fas fa-info-circle mr-1"></i>
                  Contact system administrator for the secret key
                </p>
              </div>

              <div className="flex flex-col space-y-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus mr-2"></i>
                      Create Admin Account
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Back to Login
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 px-8 py-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                <i className="fas fa-shield-alt mr-1"></i>
                Administrative privileges required. Unauthorized registration is prohibited.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;