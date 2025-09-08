import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null; // Don't show navbar on login/register pages
  }

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link className="flex items-center text-white text-xl font-bold hover:text-blue-100 transition-colors" to="/dashboard">
              <i className="fas fa-brain mr-2 text-2xl"></i>
              Quiz Game
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center" 
              to="/dashboard"
            >
              <i className="fas fa-home mr-2"></i>Dashboard
            </Link>
            <Link 
              className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center" 
              to="/quizzes"
            >
              <i className="fas fa-list mr-2"></i>Quizzes
            </Link>
            <Link 
              className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center" 
              to="/leaderboard"
            >
              <i className="fas fa-trophy mr-2"></i>Leaderboard
            </Link>
            
            {/* User Dropdown */}
            <div className="relative">
              <button
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <i className="fas fa-user mr-2"></i>
                {user?.username}
                <i className="fas fa-chevron-down ml-2"></i>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <div className="font-medium">{user?.username}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-blue-100 p-2"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-700 pb-4">
            <div className="flex flex-col space-y-2">
              <Link 
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium flex items-center" 
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-home mr-2"></i>Dashboard
              </Link>
              <Link 
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium flex items-center" 
                to="/quizzes"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-list mr-2"></i>Quizzes
              </Link>
              <Link 
                className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium flex items-center" 
                to="/leaderboard"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className="fas fa-trophy mr-2"></i>Leaderboard
              </Link>
              <div className="border-t border-primary-600 pt-2 mt-2">
                <div className="px-3 py-2 text-sm text-blue-100">
                  <div className="font-medium">{user?.username}</div>
                  <div className="text-xs">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-blue-100 px-3 py-2 rounded-md text-sm font-medium flex items-center w-full text-left"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
