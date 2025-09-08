import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const ResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [achievementsUnlocked, setAchievementsUnlocked] = useState([]);

  const fetchResultData = useCallback(async () => {
    try {
      const resultResponse = await quizAPI.getResult(id);
      const result = resultResponse.data;
      
      setResult({
        score: result.score,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.wrongAnswers,
        unanswered: result.totalQuestions - result.correctAnswers - result.wrongAnswers,
        timeTakenSeconds: result.timeTakenSeconds,
        submittedAt: result.completedAt
      });
      
      setQuiz({
        title: result.quizTitle,
        totalMarks: result.score + (result.wrongAnswers * 1)
      });
      
      const questionsFromReviews = result.answerReviews.map(review => ({
        id: review.questionId,
        questionText: review.questionText,
        optionA: review.optionA,
        optionB: review.optionB,
        optionC: review.optionC,
        optionD: review.optionD,
        correctAnswer: review.correctAnswer,
        marks: 1
      }));
      
      setQuestions(questionsFromReviews);
      
      const userAnswersFromReviews = result.answerReviews
        .filter(review => review.selectedAnswer)
        .map(review => ({
          questionId: review.questionId,
          selectedOption: review.selectedAnswer
        }));
      
      setUserAnswers(userAnswersFromReviews);
      
      // Check for achievements
      checkAchievements(result);
      
    } catch (error) {
      setError('Error loading results');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const checkAchievements = (result) => {
    const achievements = [];
    const percentage = Math.round((result.score / (result.score + result.wrongAnswers)) * 100);
    
    if (percentage === 100) {
      achievements.push({
        title: "Perfect Score!",
        description: "Answered all questions correctly",
        icon: "fas fa-trophy",
        color: "from-yellow-400 to-orange-500"
      });
      setShowConfetti(true);
    }
    
    if (percentage >= 90) {
      achievements.push({
        title: "Excellence Award",
        description: "Scored 90% or higher",
        icon: "fas fa-medal",
        color: "from-purple-400 to-pink-500"
      });
    }
    
    if (result.timeTakenSeconds < 300) { // Less than 5 minutes
      achievements.push({
        title: "Speed Demon",
        description: "Completed quiz in under 5 minutes",
        icon: "fas fa-bolt",
        color: "from-blue-400 to-cyan-500"
      });
    }
    
    if (result.correctAnswers >= 10) {
      achievements.push({
        title: "Knowledge Master",
        description: "Answered 10+ questions correctly",
        icon: "fas fa-brain",
        color: "from-green-400 to-blue-500"
      });
    }
    
    setAchievementsUnlocked(achievements);
  };

  useEffect(() => {
    fetchResultData();
  }, [fetchResultData]);

  useEffect(() => {
    // Animate score counter
    if (result && quiz) {
      const targetPercentage = Math.round((result.score / quiz.totalMarks) * 100);
      let current = 0;
      const increment = targetPercentage / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetPercentage) {
          setAnimatedScore(targetPercentage);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 30);
      
      return () => clearInterval(timer);
    }
  }, [result, quiz]);

  const getScorePercentage = () => {
    if (!result || !quiz) return 0;
    return Math.round((result.score / quiz.totalMarks) * 100);
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'from-green-500 to-emerald-600';
    if (percentage >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getPerformanceMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return { 
      message: "🎉 Exceptional! You're a quiz master!", 
      icon: "fas fa-trophy", 
      color: "text-yellow-500",
      celebration: true
    };
    if (percentage >= 80) return { 
      message: "⭐ Excellent work! Outstanding performance!", 
      icon: "fas fa-star", 
      color: "text-blue-500",
      celebration: true
    };
    if (percentage >= 70) return { 
      message: "👏 Great job! Above average performance!", 
      icon: "fas fa-thumbs-up", 
      color: "text-green-500",
      celebration: false
    };
    if (percentage >= 60) return { 
      message: "👍 Good effort! Keep practicing!", 
      icon: "fas fa-hand-paper", 
      color: "text-orange-500",
      celebration: false
    };
    return { 
      message: "💪 Don't give up! Practice makes perfect!", 
      icon: "fas fa-heart", 
      color: "text-red-500",
      celebration: false
    };
  };

  const shareResult = () => {
    const text = `I just scored ${getScorePercentage()}% on "${quiz?.title}" quiz! 🎯`;
    if (navigator.share) {
      navigator.share({
        title: 'Quiz Result',
        text: text,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('Result copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-white/30 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-20 w-20 border-4 border-transparent border-r-white/60 animate-pulse mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Calculating your results...</h2>
          <p className="text-white/70 animate-bounce">This won't take long!</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center px-4">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 max-w-md">
          <i className="fas fa-exclamation-triangle text-red-400 text-6xl mb-4 animate-bounce"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${getScoreColor()} mb-6 animate-bounce`}>
            <i className={`${performance.icon} text-4xl text-white`}></i>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-up delay-300">
            Quiz Complete! 🎯
          </h1>
          
          <h2 className="text-2xl text-white/80 mb-6 animate-fade-in-up delay-500">
            {quiz?.title}
          </h2>
          
          <p className={`text-xl font-medium ${performance.color} animate-fade-in-up delay-700`}>
            {performance.message}
          </p>
        </div>

        {/* Score Display */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 animate-fade-in-up delay-1000">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Circular Progress */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-48 h-48 mb-6">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/20"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="url(#gradient)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 88}`}
                      strokeDashoffset={`${2 * Math.PI * 88 * (1 - animatedScore / 100)}`}
                      className="transition-all duration-2000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold text-white mb-2">{animatedScore}%</span>
                    <span className="text-white/70">Score</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-3xl font-bold text-white mb-2">
                    {result?.score || 0} / {quiz?.totalMarks || questions.length}
                  </p>
                  <p className="text-white/70">Points Earned</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <i className="fas fa-chart-bar mr-3"></i>
                  Performance Breakdown
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-500/20 rounded-xl p-4 text-center border border-green-500/30">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {result?.correctAnswers || 0}
                    </div>
                    <div className="text-green-300 text-sm">Correct</div>
                  </div>
                  
                  <div className="bg-red-500/20 rounded-xl p-4 text-center border border-red-500/30">
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {result?.incorrectAnswers || 0}
                    </div>
                    <div className="text-red-300 text-sm">Wrong</div>
                  </div>
                  
                  <div className="bg-yellow-500/20 rounded-xl p-4 text-center border border-yellow-500/30">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">
                      {result?.unanswered || 0}
                    </div>
                    <div className="text-yellow-300 text-sm">Skipped</div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/20">
                  <div className="flex justify-between items-center text-white">
                    <span className="flex items-center">
                      <i className="fas fa-clock mr-3 text-blue-400"></i>
                      Time Taken
                    </span>
                    <span className="font-bold">{formatTime(result?.timeTakenSeconds || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-white">
                    <span className="flex items-center">
                      <i className="fas fa-calendar mr-3 text-green-400"></i>
                      Completed
                    </span>
                    <span className="font-bold">
                      {new Date(result?.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        {achievementsUnlocked.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up delay-1500">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                🏆 Achievements Unlocked!
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {achievementsUnlocked.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-r ${achievement.color} rounded-xl p-4 text-white animate-bounce`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="flex items-center">
                      <i className={`${achievement.icon} text-2xl mr-4`}></i>
                      <div>
                        <h4 className="font-bold">{achievement.title}</h4>
                        <p className="text-sm opacity-90">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/50 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <i className="fas fa-eye mr-2"></i>
              {showDetails ? 'Hide' : 'View'} Detailed Results
            </button>
            
            <button
              onClick={shareResult}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/50 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <i className="fas fa-share mr-2"></i>
              Share Result
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/50 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <i className="fas fa-home mr-2"></i>
              Dashboard
            </button>
            
            <button
              onClick={() => navigate('/quizzes')}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/50 px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Another Quiz
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        {showDetails && (
          <div className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <i className="fas fa-list-alt mr-3"></i>
                  Question-by-Question Analysis
                </h3>
              </div>
              
              <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers.find(ua => ua.questionId === question.id);
                  const isCorrect = userAnswer?.selectedOption === question.correctAnswer;
                  const wasAnswered = userAnswer?.selectedOption;
                  
                  return (
                    <div key={question.id} className="bg-white/10 rounded-xl p-6 border border-white/20">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          isCorrect ? 'bg-green-500' : wasAnswered ? 'bg-red-500' : 'bg-gray-500'
                        } animate-pulse`}>
                          {isCorrect ? <i className="fas fa-check"></i> : 
                           wasAnswered ? <i className="fas fa-times"></i> : 
                           <i className="fas fa-minus"></i>}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-white mb-4">
                            Q{index + 1}. {question.questionText}
                          </h4>
                          
                          <div className="grid gap-3">
                            {['A', 'B', 'C', 'D'].map((option) => {
                              const optionText = question[`option${option}`];
                              const isUserAnswer = userAnswer?.selectedOption === option;
                              const isCorrectAnswer = question.correctAnswer === option;
                              
                              let optionClass = 'p-3 rounded-lg border transition-all duration-300 ';
                              if (isCorrectAnswer) {
                                optionClass += 'bg-green-500/20 border-green-400 text-green-300';
                              } else if (isUserAnswer && !isCorrectAnswer) {
                                optionClass += 'bg-red-500/20 border-red-400 text-red-300';
                              } else {
                                optionClass += 'bg-white/10 border-white/30 text-white/70';
                              }
                              
                              return optionText ? (
                                <div key={option} className={optionClass}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <span className="font-bold mr-3">{option})</span>
                                      <span>{optionText}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      {isCorrectAnswer && (
                                        <i className="fas fa-check text-green-400"></i>
                                      )}
                                      {isUserAnswer && (
                                        <i className="fas fa-user text-blue-400"></i>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                          
                          <div className="mt-4">
                            {!wasAnswered ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/50">
                                <i className="fas fa-minus mr-2"></i>
                                No Answer
                              </span>
                            ) : isCorrect ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/50">
                                <i className="fas fa-check mr-2"></i>
                                Correct (+{question.marks || 1} point)
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300 border border-red-500/50">
                                <i className="fas fa-times mr-2"></i>
                                Incorrect (0 points)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1500 { animation-delay: 1500ms; }
      `}</style>
    </div>
  );
};

export default ResultPage;
