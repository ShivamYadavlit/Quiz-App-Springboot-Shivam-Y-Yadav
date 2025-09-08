import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { quizAPI, leaderboardAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    recentAttempts: [],
    totalAttempts: 0,
    uniqueQuizzesTaken: 0,
    totalScore: 0,
    averageScore: 0,
    rank: 0,
    achievements: []
  });
  const [availableQuizzes, setAvailableQuizzes] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  
  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboardData();
    };
    loadDashboard();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data with error handling
      const [quizzesResponse, historyResponse, , topPerformersResponse] = await Promise.allSettled([
        quizAPI.getAvailableQuizzes(),
        quizAPI.getUserHistory(),
        quizAPI.getUserHistorySummary(),
        leaderboardAPI.getTopPerformers(5)
      ]);

      // Process available quizzes
      const availableQuizzes = quizzesResponse.status === 'fulfilled' ? quizzesResponse.value.data || [] : [];
      
      // Process user history
      const userHistory = historyResponse.status === 'fulfilled' ? historyResponse.value.data || [] : [];
      
      // Process history summary (for future use)
      // const historySummary = historySummaryResponse.status === 'fulfilled' ? historySummaryResponse.value.data || [] : [];
      
      // Process top performers
      const topPerformers = topPerformersResponse.status === 'fulfilled' ? topPerformersResponse.value.data || [] : [];

      // Calculate enhanced stats
      const totalAttempts = userHistory.length;
      const uniqueQuizzes = new Set(userHistory.map(h => h.quizId)).size;
      const totalScore = userHistory.reduce((sum, h) => sum + (h.score || 0), 0);
      const averageScore = totalAttempts > 0 ? (totalScore / totalAttempts).toFixed(1) : 0;
      
      // Calculate achievements
      const achievements = calculateAchievements(userHistory, totalAttempts, uniqueQuizzes, totalScore);
      
      // Find user rank
      const userRank = topPerformers.findIndex(p => p.username === user?.username) + 1;

      setStats({
        totalQuizzes: availableQuizzes.length,
        recentAttempts: userHistory.slice(0, 5),
        totalAttempts,
        uniqueQuizzesTaken: uniqueQuizzes,
        totalScore,
        averageScore,
        rank: userRank || 'N/A',
        achievements
      });
      
      setAvailableQuizzes(availableQuizzes);
      setTopPerformers(topPerformers);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = (history, totalAttempts, uniqueQuizzes, totalScore) => {
    const achievements = [];
    
    if (totalAttempts >= 1) achievements.push({ name: 'First Steps', icon: '🌟', description: 'Completed your first quiz!' });
    if (totalAttempts >= 5) achievements.push({ name: 'Quiz Explorer', icon: '🎯', description: 'Completed 5 quizzes!' });
    if (totalAttempts >= 10) achievements.push({ name: 'Quiz Master', icon: '🏆', description: 'Completed 10 quizzes!' });
    if (uniqueQuizzes >= 3) achievements.push({ name: 'Diverse Learner', icon: '📚', description: 'Tried 3 different quizzes!' });
    if (totalScore >= 50) achievements.push({ name: 'High Scorer', icon: '⭐', description: 'Reached 50 total points!' });
    
    const perfectScores = history.filter(h => h.percentage === 100).length;
    if (perfectScores >= 1) achievements.push({ name: 'Perfectionist', icon: '💎', description: 'Got a perfect score!' });
    
    return achievements;
  };

  const StatCard = ({ title, value, icon, color, trend, onClick }) => (
    <div 
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer transform hover:scale-105 ${selectedCard === title ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => {
        setSelectedCard(selectedCard === title ? null : title);
        onClick && onClick();
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {trend && (
            <p className={`text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
              <i className={`fas fa-arrow-${trend > 0 ? 'up' : 'down'} mr-1`}></i>
              {Math.abs(trend)}%
            </p>
          )}
        </div>
        <div className={`text-4xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuizCard = ({ quiz, index }) => (
    <div 
      className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-102"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{quiz.title}</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {quiz.totalMarks} pts
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{quiz.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <i className="fas fa-clock mr-2"></i>
          {quiz.durationMinutes} min
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <i className="fas fa-questions mr-2"></i>
          Multiple Choice
        </div>
      </div>
      
      <Link
        to={`/quiz/${quiz.id}`}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
      >
        <span>Start Quiz</span>
        <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
      </Link>
    </div>
  );

  const AchievementBadge = ({ achievement, index }) => (
    <div 
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 text-center"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="text-3xl mb-2">{achievement.icon}</div>
      <h4 className="font-semibold text-gray-800 text-sm">{achievement.name}</h4>
      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-blue-600">{user?.username}!</span>
          </h1>
          <p className="text-gray-600 text-lg">Ready to challenge yourself today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Attempts" 
            value={stats.totalAttempts} 
            icon="🎯" 
            color="text-blue-600"
            trend={5}
          />
          <StatCard 
            title="Quizzes Explored" 
            value={stats.uniqueQuizzesTaken} 
            icon="📚" 
            color="text-green-600"
            trend={12}
          />
          <StatCard 
            title="Average Score" 
            value={`${stats.averageScore}%`} 
            icon="⭐" 
            color="text-yellow-600"
            trend={-2}
          />
          <StatCard 
            title="Global Rank" 
            value={stats.rank} 
            icon="🏆" 
            color="text-purple-600"
            trend={8}
          />
        </div>

        {/* Achievements Section */}
        {stats.achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <i className="fas fa-trophy text-yellow-500 mr-3"></i>
              Your Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
              {stats.achievements.map((achievement, index) => (
                <AchievementBadge key={achievement.name} achievement={achievement} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Available Quizzes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <i className="fas fa-play-circle text-blue-600 mr-3"></i>
                  Available Quizzes
                </h2>
                <Link 
                  to="/quizzes" 
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                >
                  View All
                  <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
              
              {availableQuizzes.length > 0 ? (
                <div className="grid gap-6">
                  {availableQuizzes.slice(0, 3).map((quiz, index) => (
                    <QuizCard key={quiz.id} quiz={quiz} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-question-circle text-gray-300 text-6xl mb-4"></i>
                  <p className="text-gray-500 text-lg">No quizzes available at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-history text-green-600 mr-3"></i>
                Recent Activity
              </h3>
              
              {stats.recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentAttempts.map((attempt, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{attempt.quizTitle}</p>
                        <p className="text-xs text-gray-500">{attempt.completedAt}</p>
                      </div>
                      <div className={`text-right ${attempt.percentage >= 70 ? 'text-green-600' : attempt.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        <p className="font-bold text-sm">{attempt.percentage}%</p>
                        <p className="text-xs">{attempt.score} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-clock text-gray-300 text-3xl mb-2"></i>
                  <p className="text-gray-500">No recent activity</p>
                </div>
              )}
              
              <Link 
                to="/history" 
                className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View Full History
              </Link>
            </div>

            {/* Top Performers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-crown text-yellow-500 mr-3"></i>
                Top Performers
              </h3>
              
              {topPerformers.length > 0 ? (
                <div className="space-y-3">
                  {topPerformers.slice(0, 5).map((performer, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        performer.username === user?.username 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 text-sm">
                            {performer.username}
                            {performer.username === user?.username && (
                              <span className="text-blue-600 text-xs ml-1">(You)</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{performer.quizzesTaken} quizzes</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-gray-900">{performer.averageScore}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-trophy text-gray-300 text-3xl mb-2"></i>
                  <p className="text-gray-500">No rankings yet</p>
                </div>
              )}
              
              <Link 
                to="/leaderboard" 
                className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">Ready for your next challenge?</h3>
              <p className="text-blue-100">Discover new quizzes and improve your knowledge!</p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/quizzes"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2 px-6 rounded-lg transition-colors duration-300 flex items-center"
              >
                <i className="fas fa-search mr-2"></i>
                Browse Quizzes
              </Link>
              <Link
                to="/leaderboard"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 flex items-center"
              >
                <i className="fas fa-trophy mr-2"></i>
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
