import React from 'react';
import { Link } from 'react-router-dom';

const AdminAccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-red-600 rounded-full flex items-center justify-center mb-4">
            <i className="fas fa-shield-alt text-3xl text-white"></i>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Secure Admin Access
          </h2>
          <p className="text-gray-300 mb-8">
            Administrative access requires separate authentication for security purposes.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center text-yellow-400 mb-2">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <span className="font-semibold">Security Notice</span>
                </div>
                <p className="text-sm text-yellow-200">
                  Admin panel access requires separate secure authentication. Regular user credentials cannot be used.
                </p>
              </div>
            </div>

            <Link
              to="/admin/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <i className="fas fa-key mr-2"></i>
              Secure Admin Login
            </Link>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to Application
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-black/20 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-2">Security Features:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Separate admin authentication system</li>
              <li>• JWT-based secure token validation</li>
              <li>• Role-based access control</li>
              <li>• Session timeout protection</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
