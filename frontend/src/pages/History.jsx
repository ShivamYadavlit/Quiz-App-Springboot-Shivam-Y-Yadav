import React, { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import { Link } from 'react-router-dom';

const History = () => {
  const [loading, setLoading] = useState(true);
  const [detailedHistory, setDetailedHistory] = useState([]);
  const [showDetailed, setShowDetailed] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    fetchHistoryData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHistoryData = async () => {
    try {
      const detailedResponse = await quizAPI.getUserHistory();
      setDetailedHistory(detailedResponse.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScorePercentage = (score, total) => {
    return Math.round((score / total) * 100);
  };

  const getScoreColor = (score, total) => {
    const percentage = getScorePercentage(score, total);
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getPerformanceIcon = (score, total) => {
    const percentage = getScorePercentage(score, total);
    if (percentage >= 90) return 'fas fa-trophy';
    if (percentage >= 80) return 'fas fa-medal';
    if (percentage >= 70) return 'fas fa-star';
    if (percentage >= 60) return 'fas fa-thumbs-up';
    return 'fas fa-heart';
  };

  const getFilteredHistory = () => {
    let filtered = [...detailedHistory];
    
    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filterPeriod) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.completedAt) >= filterDate);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.completedAt) - new Date(a.completedAt);
        case 'oldest':
          return new Date(a.completedAt) - new Date(b.completedAt);
        case 'score':
          return b.score - a.score;
        case 'quiz':
          return a.quizTitle.localeCompare(b.quizTitle);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const getOverallStats = () => {
    if (detailedHistory.length === 0) return null;
    
    const totalQuizzes = detailedHistory.length;
    const totalScore = detailedHistory.reduce((sum, item) => sum + item.score, 0);
    const totalPossible = detailedHistory.reduce((sum, item) => sum + (item.score + item.wrongAnswers), 0);
    const averageScore = Math.round((totalScore / totalPossible) * 100);
    const bestScore = Math.max(...detailedHistory.map(item => getScorePercentage(item.score, item.score + item.wrongAnswers)));
    const totalTimeSpentMinutes = Math.round(detailedHistory.reduce((sum, item) => sum + item.timeTakenSeconds, 0) / 60);
    
    return {
      totalQuizzes,
      averageScore,
      bestScore,
      totalTimeSpentMinutes,
      totalCorrectAnswers: detailedHistory.reduce((sum, item) => sum + item.correctAnswers, 0)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-white/60 animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Loading your quiz history...</h2>
          <p className="text-white/70 animate-bounce">Analyzing your performance!</p>
        </div>
      </div>
    );
  }

  const stats = getOverallStats();
  const filteredHistory = getFilteredHistory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-6 animate-bounce">
            <i className="fas fa-history text-3xl text-white"></i>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            📊 Your Quiz Journey
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Track your progress, celebrate achievements, and see how far you've come!
          </p>
        </div>

        {/* Overall Statistics */}
        {stats && (
          <div className="max-w-6xl mx-auto mb-12 animate-fade-in-up delay-300">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                <i className="fas fa-chart-line mr-3"></i>
                Performance Overview
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="bg-blue-500/20 rounded-xl p-4 mb-2">
                    <i className="fas fa-clipboard-list text-3xl text-blue-400 mb-2"></i>
                    <div className="text-2xl font-bold text-white">{stats.totalQuizzes}</div>
                  </div>
                  <div className="text-white/70 text-sm">Quizzes Taken</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-500/20 rounded-xl p-4 mb-2">
                    <i className="fas fa-percentage text-3xl text-green-400 mb-2"></i>
                    <div className="text-2xl font-bold text-white">{stats.averageScore}%</div>
                  </div>
                  <div className="text-white/70 text-sm">Average Score</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-yellow-500/20 rounded-xl p-4 mb-2">
                    <i className="fas fa-trophy text-3xl text-yellow-400 mb-2"></i>
                    <div className="text-2xl font-bold text-white">{stats.bestScore}%</div>
                  </div>
                  <div className="text-white/70 text-sm">Best Score</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-500/20 rounded-xl p-4 mb-2">
                    <i className="fas fa-check-circle text-3xl text-purple-400 mb-2"></i>
                    <div className="text-2xl font-bold text-white">{stats.totalCorrectAnswers}</div>
                  </div>
                  <div className="text-white/70 text-sm">Correct Answers</div>
                </div>
                
                <div className="text-center">
                  <div className="bg-indigo-500/20 rounded-xl p-4 mb-2">
                    <i className="fas fa-clock text-3xl text-indigo-400 mb-2"></i>
                    <div className="text-2xl font-bold text-white">{stats.totalTimeSpentMinutes}m</div>
                  </div>
                  <div className="text-white/70 text-sm">Time Spent</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up delay-500">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="grid md:grid-cols-3 gap-4">
              
              {/* Period Filter */}
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-all duration-300"
              >
                <option value="all" className="bg-gray-800">All Time</option>
                <option value="week" className="bg-gray-800">Last Week</option>
                <option value="month" className="bg-gray-800">Last Month</option>
                <option value="year" className="bg-gray-800">Last Year</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-all duration-300"
              >
                <option value="recent" className="bg-gray-800">Most Recent</option>
                <option value="oldest" className="bg-gray-800">Oldest First</option>
                <option value="score" className="bg-gray-800">Highest Score</option>
                <option value="quiz" className="bg-gray-800">Quiz Name</option>
              </select>

              {/* View Toggle */}
              <button
                onClick={() => setShowDetailed(!showDetailed)}
                className={`px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                  showDetailed 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 border border-white/30 text-white hover:bg-white/20'
                }`}
              >
                <i className={`fas ${showDetailed ? 'fa-th-large' : 'fa-list'} mr-2`}></i>
                {showDetailed ? 'Card View' : 'List View'}
              </button>
            </div>
          </div>
        </div>

        {/* History Display */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up delay-700">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 max-w-md mx-auto">
              <i className="fas fa-inbox text-6xl text-white/40 mb-6"></i>
              <h3 className="text-2xl font-bold text-white mb-4">No Quiz History Yet</h3>
              <p className="text-white/70 mb-6">
                Start taking quizzes to build your learning journey and track your progress!
              </p>
              <Link
                to="/quizzes"
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 px-6 py-3 rounded-lg transition-all duration-300 inline-flex items-center"
              >
                <i className="fas fa-play mr-2"></i>
                Take Your First Quiz
              </Link>
            </div>
          </div>
        ) : (
          <div className={`max-w-6xl mx-auto animate-fade-in-up delay-700 ${
            showDetailed ? 'space-y-6' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
          }`}>
            {filteredHistory.map((item, index) => (
              <div
                key={item.id}
                className={`group bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-slide-up ${
                  showDetailed ? 'p-6' : 'p-4'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {showDetailed ? (
                  // Detailed View
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getScoreColor(item.score, item.score + item.wrongAnswers)} flex items-center justify-center text-white text-xl animate-pulse`}>
                      <i className={getPerformanceIcon(item.score, item.score + item.wrongAnswers)}></i>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{item.quizTitle}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-white/70">
                          <i className="fas fa-percentage mr-2 text-green-400"></i>
                          {getScorePercentage(item.score, item.score + item.wrongAnswers)}%
                        </div>
                        <div className="flex items-center text-white/70">
                          <i className="fas fa-clock mr-2 text-blue-400"></i>
                          {Math.round(item.timeTakenSeconds / 60)}m
                        </div>
                        <div className="flex items-center text-white/70">
                          <i className="fas fa-check mr-2 text-green-400"></i>
                          {item.correctAnswers} correct
                        </div>
                        <div className="flex items-center text-white/70">
                          <i className="fas fa-calendar mr-2 text-purple-400"></i>
                          {formatDate(item.completedAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {item.score}/{item.score + item.wrongAnswers}
                      </div>
                      <Link
                        to={`/result/${item.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-300"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                ) : (
                  // Card View
                  <div className="text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${getScoreColor(item.score, item.score + item.wrongAnswers)} flex items-center justify-center text-white animate-pulse`}>
                      <i className={getPerformanceIcon(item.score, item.score + item.wrongAnswers)}></i>
                    </div>
                    
                    <h3 className="text-white font-bold mb-2 line-clamp-2">{item.quizTitle}</h3>
                    
                    <div className="text-3xl font-bold text-white mb-2">
                      {getScorePercentage(item.score, item.score + item.wrongAnswers)}%
                    </div>
                    
                    <div className="text-white/70 text-sm mb-4">
                      {item.score}/{item.score + item.wrongAnswers} • {Math.round(item.timeTakenSeconds / 60)}m
                    </div>
                    
                    <div className="text-white/60 text-xs mb-4">
                      {formatDate(item.completedAt)}
                    </div>
                    
                    <Link
                      to={`/result/${item.id}`}
                      className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 px-4 py-2 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 inline-flex items-center"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Results
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredHistory.length > 0 && (
          <div className="text-center mt-16 animate-fade-in-up delay-1000">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Keep Learning & Growing! 🚀</h3>
              <p className="text-white/70 mb-6">
                Your quiz journey shows great progress. Continue challenging yourself with more quizzes 
                to expand your knowledge and improve your scores!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/quizzes"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <i className="fas fa-play mr-2"></i>
                  Take Another Quiz
                </Link>
                <Link
                  to="/dashboard"
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default History;
