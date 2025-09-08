import React, { useState, useEffect } from 'react';
import { adminAPI, leaderboardAPI } from '../services/api';
import QuizManagement from '../components/QuizManagement';
import QuizCreationForm from '../components/QuizCreationForm';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dashboard Data
  const [dashboardStats, setDashboardStats] = useState({});
  
  // Quiz Data
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizForm, setShowQuizForm] = useState(false);
  
  // User Data
  const [users, setUsers] = useState([]);
  
  // Results Data
  const [results, setResults] = useState([]);
  
  // Reports Data
  const [reports, setReports] = useState({
    userActivity: [],
    quizPerformance: [],
    recentActivity: []
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    } else if (activeTab === 'quizzes') {
      fetchQuizzes();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, leaderboardStats] = await Promise.all([
        adminAPI.getDashboardStats(),
        leaderboardAPI.getLeaderboardStats()
      ]);
      setDashboardStats({
        ...(statsResponse.data || {}),
        ...(leaderboardStats.data || {})
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
      // Set default values to prevent undefined errors
      setDashboardStats({
        totalUsers: 0,
        totalQuizzes: 0,
        totalAttempts: 0,
        averageScore: 0,
        activeUsers: 0,
        publishedQuizzes: 0,
        totalParticipants: 0,
        highestScore: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllQuizzes();
      setQuizzes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes');
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsersWithStats();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [userActivity, quizPerformance, recentActivity] = await Promise.all([
        adminAPI.getUserActivityReport(),
        adminAPI.getQuizPerformanceReport(),
        adminAPI.getRecentActivityReport(30)
      ]);
      setReports({
        userActivity: Array.isArray(userActivity.data) ? userActivity.data : [],
        quizPerformance: Array.isArray(quizPerformance.data) ? quizPerformance.data : [],
        recentActivity: Array.isArray(recentActivity.data) ? recentActivity.data : []
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports');
      // Set empty arrays to prevent undefined errors
      setReports({
        userActivity: [],
        quizPerformance: [],
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        setError('Failed to delete user');
      }
    }
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
        </div>
        <div className={`text-${color}-600`}>
          <i className={`fas ${icon} text-2xl`}></i>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-200'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <i className={`fas ${icon} mr-1 sm:mr-2`}></i>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(' ')[0]}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <i className="fas fa-cogs text-blue-600 text-xl sm:text-2xl mr-2 sm:mr-3"></i>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="text-xs sm:text-sm text-gray-600 truncate max-w-full sm:max-w-none">
                Welcome, {JSON.parse(localStorage.getItem('adminUser') || '{}').username || 'Admin'}
              </div>
              <button
                onClick={handleLogout}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded w-full sm:w-auto"
              >
                <i className="fas fa-sign-out-alt mr-1"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
          <TabButton
            id="dashboard"
            label="Dashboard"
            icon="fa-tachometer-alt"
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />
          <TabButton
            id="quizzes"
            label="Quiz Management"
            icon="fa-list-alt"
            isActive={activeTab === 'quizzes'}
            onClick={() => setActiveTab('quizzes')}
          />
          <TabButton
            id="quiz-builder"
            label="Quiz Builder"
            icon="fa-plus-circle"
            isActive={activeTab === 'quiz-builder'}
            onClick={() => setActiveTab('quiz-builder')}
          />
          <TabButton
            id="users"
            label="User Management"
            icon="fa-users"
            isActive={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
          />
          <TabButton
            id="reports"
            label="Reports"
            icon="fa-chart-bar"
            isActive={activeTab === 'reports'}
            onClick={() => setActiveTab('reports')}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Tab Content */}
        {!loading && (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  <StatCard
                    title="Total Users"
                    value={dashboardStats.totalUsers}
                    icon="fa-users"
                    color="blue"
                  />
                  <StatCard
                    title="Total Quizzes"
                    value={dashboardStats.totalQuizzes}
                    icon="fa-list-alt"
                    color="green"
                  />
                  <StatCard
                    title="Total Attempts"
                    value={dashboardStats.totalAttempts}
                    icon="fa-clipboard-list"
                    color="purple"
                  />
                  <StatCard
                    title="Average Score"
                    value={Math.round(dashboardStats.averageScore || 0)}
                    icon="fa-chart-line"
                    color="yellow"
                  />
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Quick Stats</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active Users:</span>
                            <span className="font-semibold">{dashboardStats.activeUsers || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Published Quizzes:</span>
                            <span className="font-semibold">{dashboardStats.publishedQuizzes || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Participants:</span>
                            <span className="font-semibold">{dashboardStats.totalParticipants || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Highest Score:</span>
                            <span className="font-semibold">{Math.round(dashboardStats.highestScore || 0)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">System Health</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Database Connected</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">API Services Online</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Authentication Active</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Management Tab */}
            {activeTab === 'quizzes' && <QuizManagement />}

            {/* Quiz Builder Tab */}
            {activeTab === 'quiz-builder' && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Create New Quiz</h3>
                  </div>
                  <div className="p-4">
                    <QuizCreationForm
                      onQuizCreated={(quiz) => {
                        setQuizzes([...quizzes, quiz]);
                        setActiveTab('quizzes');
                      }}
                      onClose={() => setActiveTab('quizzes')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                </div>
                <div className="p-4">
                  {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <i className="fas fa-users text-4xl mb-4"></i>
                      <p>No users found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse min-w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Username</th>
                            <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm hidden sm:table-cell">Email</th>
                            <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Quizzes</th>
                            <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Avg Score</th>
                            <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-2 sm:px-4 py-2 font-medium text-xs sm:text-sm">
                                <div className="truncate" title={user.username}>
                                  {user.username}
                                </div>
                                <div className="sm:hidden text-xs text-gray-500 truncate" title={user.email}>
                                  {user.email}
                                </div>
                              </td>
                              <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm hidden sm:table-cell">
                                {user.email}
                              </td>
                              <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm text-center">
                                {user.totalQuizzes || 0}
                              </td>
                              <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm text-center">
                                {Math.round(user.averageScore || 0)}%
                              </td>
                              <td className="border border-gray-200 px-2 sm:px-4 py-2">
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-800 text-xs sm:text-sm px-1 py-1 rounded"
                                >
                                  <i className="fas fa-trash sm:hidden"></i>
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="space-y-6">
                {/* User Activity Report */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">User Activity Report</h3>
                  </div>
                  <div className="p-4">
                    {(!reports.userActivity || reports.userActivity.length === 0) ? (
                      <p className="text-gray-500 text-center py-4">No user activity data</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">User</th>
                              <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Attempts</th>
                              <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Avg Score</th>
                              <th className="border border-gray-200 px-2 sm:px-4 py-2 text-left text-xs sm:text-sm hidden sm:table-cell">Last Activity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.userActivity.map((activity, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm">
                                  <div className="truncate" title={activity.username || 'N/A'}>
                                    {activity.username || 'N/A'}
                                  </div>
                                </td>
                                <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm text-center">
                                  {activity.totalAttempts || 0}
                                </td>
                                <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm text-center">
                                  {Math.round(activity.averageScore || 0)}%
                                </td>
                                <td className="border border-gray-200 px-2 sm:px-4 py-2 text-xs sm:text-sm hidden sm:table-cell">
                                  {activity.lastAttempt ? new Date(activity.lastAttempt).toLocaleDateString() : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quiz Performance Report */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Quiz Performance Report</h3>
                  </div>
                  <div className="p-4">
                    {(!reports.quizPerformance || reports.quizPerformance.length === 0) ? (
                      <p className="text-gray-500 text-center py-4">No quiz performance data</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-200 px-4 py-2 text-left">Quiz Title</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Total Attempts</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Avg Score</th>
                              <th className="border border-gray-200 px-4 py-2 text-left">Highest Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reports.quizPerformance.map((performance, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="border border-gray-200 px-4 py-2 font-medium">
                                  {performance.quizTitle || 'N/A'}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  {performance.totalAttempts || 0}
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  {Math.round(performance.averageScore || 0)}%
                                </td>
                                <td className="border border-gray-200 px-4 py-2">
                                  {Math.round(performance.highestScore || 0)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;