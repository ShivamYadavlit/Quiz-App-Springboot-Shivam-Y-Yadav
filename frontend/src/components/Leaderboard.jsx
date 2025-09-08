import React, { useState, useEffect } from 'react';
import { leaderboardAPI, adminAPI, quizAPI } from '../services/api';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();
    fetchQuizzes();
  }, [activeTab, selectedQuizId]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      let response;

      switch (activeTab) {
        case 'global':
          response = await leaderboardAPI.getGlobalLeaderboard(50);
          break;
        case 'quiz':
          if (selectedQuizId) {
            response = await leaderboardAPI.getQuizLeaderboard(selectedQuizId, 20);
          } else {
            setLeaderboardData([]);
            return;
          }
          break;
        case 'topPerformers':
          response = await leaderboardAPI.getTopPerformers(20);
          break;
        case 'weekly':
          response = await leaderboardAPI.getWeeklyLeaderboard(20);
          break;
        case 'monthly':
          response = await leaderboardAPI.getMonthlyLeaderboard(20);
          break;
        case 'recent':
          response = await leaderboardAPI.getRecentTopScores(7, 20);
          break;
        case 'myRanking':
          // Get username from localStorage
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const username = user.username;
          if (username) {
            response = await leaderboardAPI.getMyRanking(username);
          } else {
            setError('Please login to see your ranking');
            setLeaderboardData([]);
            return;
          }
          break;
        default:
          response = await leaderboardAPI.getGlobalLeaderboard(50);
      }

      // Handle response data - check if response.data exists, otherwise use response directly
      const data = response.data || response;
      // Ensure data is an array and filter out any null/undefined entries
      const validData = Array.isArray(data) ? data.filter(entry => entry && typeof entry === 'object') : [];
      setLeaderboardData(validData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard data. Please try again.');
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboardStats();
      const data = response.data || response;
      setStats(data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show error for stats, just use empty object
      setStats({});
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAllQuizzes();
      const data = response.data || response;
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      // Try fallback with admin API
      try {
        const adminResponse = await adminAPI.getAllQuizzes();
        const adminData = adminResponse.data || adminResponse;
        setQuizzes(Array.isArray(adminData) ? adminData : []);
      } catch (adminError) {
        console.error('Error fetching quizzes from admin API:', adminError);
        setQuizzes([]);
      }
    }
  };

  const getRankDisplay = (rank) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBadge = (entry) => {
    const percentage = entry.percentage || 0;
    if (percentage >= 95) {
      return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">Exceptional</span>;
    }
    if (percentage >= 85) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Excellent</span>;
    }
    if (percentage >= 75) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Good</span>;
    }
    if (percentage >= 60) {
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Average</span>;
    }
    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Needs Improvement</span>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <i className="fas fa-trophy text-yellow-500 mr-3"></i>
          Leaderboard
        </h1>
        <p className="text-gray-600">Track top performers and quiz statistics</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Participants</p>
              <p className="text-3xl font-bold">{stats.totalParticipants || 0}</p>
            </div>
            <i className="fas fa-users text-3xl text-blue-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Attempts</p>
              <p className="text-3xl font-bold">{stats.totalAttempts || 0}</p>
            </div>
            <i className="fas fa-clipboard-list text-3xl text-green-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold">{Math.round(stats.averageScore || 0)}</p>
            </div>
            <i className="fas fa-chart-line text-3xl text-yellow-200"></i>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Highest Score</p>
              <p className="text-3xl font-bold">{Math.round(stats.highestScore || 0)}</p>
            </div>
            <i className="fas fa-star text-3xl text-purple-200"></i>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'global'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-globe mr-2"></i>
            Global Leaderboard
          </button>
          
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'quiz'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-quiz mr-2"></i>
            Quiz Specific
          </button>
          
          <button
            onClick={() => setActiveTab('topPerformers')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'topPerformers'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-medal mr-2"></i>
            Top Performers
          </button>
          
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'weekly'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-calendar-week mr-2"></i>
            Weekly
          </button>
          
          <button
            onClick={() => setActiveTab('monthly')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'monthly'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-calendar-alt mr-2"></i>
            Monthly
          </button>
          
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'recent'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-clock mr-2"></i>
            Recent Scores
          </button>
          
          <button
            onClick={() => setActiveTab('myRanking')}
            className={`px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'myRanking'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-user mr-2"></i>
            My Ranking
          </button>
        </div>

        {/* Quiz Selection for Quiz Specific Tab */}
        {activeTab === 'quiz' && (
          <div className="p-6 border-b border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Quiz:
            </label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="w-full md:w-64 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a quiz...</option>
              {quizzes.map(quiz => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Personal Summary for My Ranking */}
      {activeTab === 'myRanking' && !loading && !error && leaderboardData.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg mb-6">
          <h3 className="text-xl font-bold mb-4">
            <i className="fas fa-user-crown mr-2"></i>
            Your Personal Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {leaderboardData.find(entry => entry.rank)?.rank || 'N/A'}
              </div>
              <div className="text-sm opacity-90">Best Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {leaderboardData.length}
              </div>
              <div className="text-sm opacity-90">Total Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(leaderboardData.reduce((sum, entry) => sum + (entry?.score || 0), 0) / Math.max(leaderboardData.length, 1)) || 0}
              </div>
              <div className="text-sm opacity-90">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Math.round(leaderboardData.reduce((sum, entry) => sum + (entry?.percentage || 0), 0) / Math.max(leaderboardData.length, 1)) || 0}%
              </div>
              <div className="text-sm opacity-90">Average Percentage</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <i className="fas fa-spinner fa-spin text-3xl text-gray-400"></i>
            <span className="ml-3 text-gray-500">Loading leaderboard...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">
            <i className="fas fa-exclamation-triangle text-3xl mb-3"></i>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <i className="fas fa-refresh mr-2"></i>
              Try Again
            </button>
          </div>
        ) : leaderboardData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-trophy text-4xl mb-3"></i>
            <p className="text-lg mb-2">No data available</p>
            <p className="text-sm">
              {activeTab === 'quiz' && !selectedQuizId 
                ? 'Please select a quiz to view its leaderboard' 
                : 'Be the first to take a quiz and appear on the leaderboard!'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Rank</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                  {activeTab === 'global' && (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Attempts</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                    </>
                  )}
                  {activeTab === 'quiz' && (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                    </>
                  )}
                  {activeTab === 'recent' && (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Quiz</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                    </>
                  )}
                  {activeTab === 'myRanking' && (
                    <>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Quiz</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Score</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                    </>
                  )}
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Performance</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardData.map((entry, index) => {
                  // Ensure entry has all required fields with fallbacks
                  const safeEntry = {
                    userId: entry.userId || `user-${index}`,
                    username: entry.username || 'Unknown User',
                    email: entry.email || '',
                    score: entry.score || 0,
                    percentage: entry.percentage || 0,
                    rank: entry.rank || (index + 1),
                    totalAttempts: entry.totalAttempts || 0,
                    timeTaken: entry.timeTaken || 0,
                    quizTitle: entry.quizTitle || 'N/A',
                    completedAt: entry.completedAt || null
                  };
                  
                  return (
                  <tr key={safeEntry.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        {getRankDisplay(safeEntry.rank)}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                          {safeEntry.username && safeEntry.username.length > 0 ? safeEntry.username.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{safeEntry.username}</p>
                          <p className="text-sm text-gray-500">{safeEntry.email}</p>
                        </div>
                      </div>
                    </td>

                    {activeTab === 'global' && (
                      <>
                        <td className="py-4 px-6">
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {safeEntry.totalAttempts}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {Math.round(safeEntry.score)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {Math.round(safeEntry.score)}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'quiz' && (
                      <>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {Math.round(safeEntry.score)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600">
                            {safeEntry.timeTaken ? `${Math.round(safeEntry.timeTaken / 60)}min` : 'N/A'}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'recent' && (
                      <>
                        <td className="py-4 px-6">
                          <span className="text-gray-900 font-medium">
                            {safeEntry.quizTitle}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {Math.round(safeEntry.score)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600 text-sm">
                            {safeEntry.completedAt ? new Date(safeEntry.completedAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                      </>
                    )}

                    {activeTab === 'myRanking' && (
                      <>
                        <td className="py-4 px-6">
                          <span className="text-gray-900 font-medium">
                            {safeEntry.quizTitle}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">
                            {Math.round(safeEntry.score)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-gray-600 text-sm">
                            {safeEntry.completedAt ? new Date(safeEntry.completedAt).toLocaleDateString() : 'N/A'}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="py-4 px-6">
                      {getPerformanceBadge(safeEntry)}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className={`font-bold text-lg ${getScoreColor(safeEntry.percentage)}`}>
                          {Math.round(safeEntry.percentage)}%
                        </span>
                        <div className="ml-3 w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              safeEntry.percentage >= 90 ? 'bg-green-500' :
                              safeEntry.percentage >= 75 ? 'bg-blue-500' :
                              safeEntry.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(safeEntry.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
