import React, { useState, useEffect } from 'react';
import { quizAPI } from '../services/api';
import { Link } from 'react-router-dom';

const AvailableQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchQuizzes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let filtered = quizzes.filter(quiz =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterDifficulty !== 'all') {
      filtered = filtered.filter(quiz => quiz.difficulty === filterDifficulty);
    }

    // Sort quizzes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return a.durationMinutes - b.durationMinutes;
        case 'questions':
          return (b.questions?.length || 0) - (a.questions?.length || 0);
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
          return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
        default:
          return 0;
      }
    });

    setFilteredQuizzes(filtered);
  }, [quizzes, searchTerm, filterDifficulty, sortBy]);

  const fetchQuizzes = async () => {
    try {
      const response = await quizAPI.getAvailableQuizzes();
      // Use the difficulty from backend, with fallback to medium if not set
      const quizzesWithDifficulty = response.data.map(quiz => ({
        ...quiz,
        difficulty: (quiz.difficulty || 'MEDIUM').toLowerCase()
      }));
      setQuizzes(quizzesWithDifficulty);
    } catch (error) {
      setError('Error fetching quizzes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'fas fa-leaf';
      case 'medium': return 'fas fa-fire';
      case 'hard': return 'fas fa-bolt';
      default: return 'fas fa-star';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-white/60 animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Loading amazing quizzes...</h2>
          <p className="text-white/70 animate-bounce">Get ready to test your knowledge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-4">
      
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-center mb-6">
            <Link 
              to="/dashboard" 
              className="text-white/60 hover:text-white transition-colors duration-300 flex items-center"
            >
              <i className="fas fa-home mr-2"></i>
              Dashboard
            </Link>
            <i className="fas fa-chevron-right mx-3 text-white/40"></i>
            <span className="text-white font-semibold">Available Quizzes</span>
          </div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mb-6 animate-bounce">
            <i className="fas fa-brain text-3xl text-white"></i>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            🎯 Quiz Collection
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Challenge yourself with our curated collection of engaging quizzes. Test your knowledge and compete with others!
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up delay-300">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60"></i>
                  <input
                    type="text"
                    placeholder="Search quizzes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/60 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-all duration-300"
              >
                <option value="all" className="bg-gray-800">All Difficulties</option>
                <option value="easy" className="bg-gray-800">Easy</option>
                <option value="medium" className="bg-gray-800">Medium</option>
                <option value="hard" className="bg-gray-800">Hard</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-all duration-300"
              >
                <option value="title" className="bg-gray-800">Sort by Title</option>
                <option value="duration" className="bg-gray-800">Sort by Duration</option>
                <option value="questions" className="bg-gray-800">Sort by Questions</option>
                <option value="difficulty" className="bg-gray-800">Sort by Difficulty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8 animate-shake">
            <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 text-center">
              <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
              <p className="text-red-300 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Quiz Statistics */}
        <div className="max-w-4xl mx-auto mb-8 animate-fade-in-up delay-500">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-white">{quizzes.length}</div>
              <div className="text-white/70 text-sm">Total Quizzes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-green-400">{quizzes.filter(q => q.difficulty === 'easy').length}</div>
              <div className="text-white/70 text-sm">Easy</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">{quizzes.filter(q => q.difficulty === 'medium').length}</div>
              <div className="text-white/70 text-sm">Medium</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <div className="text-2xl font-bold text-red-400">{quizzes.filter(q => q.difficulty === 'hard').length}</div>
              <div className="text-white/70 text-sm">Hard</div>
            </div>
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up delay-700">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 max-w-md mx-auto">
              <i className="fas fa-search text-6xl text-white/40 mb-6"></i>
              <h3 className="text-2xl font-bold text-white mb-4">No Quizzes Found</h3>
              <p className="text-white/70 mb-6">
                {searchTerm || filterDifficulty !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Check back later for new quizzes!'}
              </p>
              {(searchTerm || filterDifficulty !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDifficulty('all');
                  }}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 px-6 py-3 rounded-lg transition-all duration-300"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 animate-fade-in-up delay-700">
            {filteredQuizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Quiz Header */}
                <div className={`bg-gradient-to-r ${getDifficultyColor(quiz.difficulty)} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/20`}>
                        <i className={`${getDifficultyIcon(quiz.difficulty)} mr-1`}></i>
                        {quiz.difficulty?.charAt(0).toUpperCase() + quiz.difficulty?.slice(1)}
                      </div>
                      <div className="flex items-center text-sm">
                        <i className="fas fa-clock mr-1"></i>
                        {quiz.durationMinutes}m
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:scale-105 transition-transform duration-300">
                      {quiz.title}
                    </h3>
                  </div>
                </div>

                {/* Quiz Content */}
                <div className="p-6">
                  <p className="text-white/80 mb-6 line-clamp-3">
                    {quiz.description || 'Test your knowledge with this engaging quiz. Perfect for learning and skill assessment.'}
                  </p>

                  {/* Quiz Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <i className="fas fa-question-circle text-blue-400 text-lg mb-1"></i>
                      <div className="text-white font-semibold">{quiz.questions?.length || 'N/A'}</div>
                      <div className="text-white/60 text-xs">Questions</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <i className="fas fa-star text-yellow-400 text-lg mb-1"></i>
                      <div className="text-white font-semibold">{quiz.totalMarks || 'N/A'}</div>
                      <div className="text-white/60 text-xs">Max Score</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/quiz/${quiz.id}`}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center group-hover:animate-pulse"
                  >
                    <i className="fas fa-play mr-3"></i>
                    Start Quiz
                    <i className="fas fa-arrow-right ml-3 transition-transform duration-300 group-hover:translate-x-1"></i>
                  </Link>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {filteredQuizzes.length > 0 && (
          <div className="text-center mt-16 animate-fade-in-up delay-1000">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Challenge Yourself?</h3>
              <p className="text-white/70 mb-6">
                Each quiz is designed to test your knowledge and help you learn something new. 
                Track your progress and compete with others!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <i className="fas fa-chart-line mr-2"></i>
                  View Progress
                </Link>
                <Link
                  to="/history"
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <i className="fas fa-history mr-2"></i>
                  Quiz History
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Navigation Footer */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <Link 
          to="/dashboard"
          className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          title="Back to Dashboard"
        >
          <i className="fas fa-home text-lg"></i>
        </Link>
        <Link 
          to="/history"
          className="group bg-gradient-to-r from-green-500 to-teal-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          title="View History"
        >
          <i className="fas fa-history text-lg"></i>
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
          title="Scroll to Top"
        >
          <i className="fas fa-arrow-up text-lg"></i>
        </button>
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
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AvailableQuizzes;
