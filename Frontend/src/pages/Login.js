import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [fadeIn, setFadeIn] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Add form validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData);
      login(response.data);
      
      // Success animation
      const form = e.target;
      form.classList.add('animate-pulse');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      setError(error.response?.data || 'Login failed. Please check your credentials.');
      // Shake animation on error
      const form = e.target;
      form.classList.add('animate-shake');
      setTimeout(() => form.classList.remove('animate-shake'), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full opacity-10 animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className={`max-w-md w-full transition-all duration-1000 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-6 shadow-xl animate-bounce">
            <i className="fas fa-brain text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Quiz<span className="text-blue-300">Master</span>
          </h1>
          <p className="text-blue-200">Welcome back! Sign in to continue your journey</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-400/50 rounded-lg backdrop-blur-sm animate-fadeIn">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-400 mr-3"></i>
                <p className="text-red-100 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Username Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-white/90 mb-2">
                <i className="fas fa-user mr-2 text-blue-300"></i>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                className={`w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/20 ${
                  focusedField === 'username' ? 'scale-105 shadow-lg' : ''
                }`}
                placeholder="Enter your username"
                required
              />
              {focusedField === 'username' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-indigo-400/20 -z-10 animate-pulse"></div>
              )}
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-white/90 mb-2">
                <i className="fas fa-lock mr-2 text-blue-300"></i>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  className={`w-full px-4 py-3 pr-12 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/20 ${
                    focusedField === 'password' ? 'scale-105 shadow-lg' : ''
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {focusedField === 'password' && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-indigo-400/20 -z-10 animate-pulse"></div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
                loading 
                  ? 'bg-gray-600 cursor-not-allowed scale-95' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-105 hover:shadow-xl active:scale-95'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="px-4 text-white/60 text-sm">or</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-white/80 text-sm mb-4">
              Don't have an account?
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-white/30 rounded-lg text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Create Account
            </Link>
          </div>

          {/* Admin Access Link */}
          <div className="mt-6 text-center">
            <Link
              to="/admin"
              className="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm transition-colors duration-300"
            >
              <i className="fas fa-shield-alt mr-2"></i>
              Admin Access
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-xs">
            Secure login powered by JWT authentication
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
