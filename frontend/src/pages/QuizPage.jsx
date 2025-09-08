import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [progressAnimated, setProgressAnimated] = useState(false);

  const fetchQuizData = useCallback(async () => {
    try {
      const [quizResponse, questionsResponse] = await Promise.all([
        quizAPI.getQuiz(id),
        quizAPI.getQuizQuestions(id)
      ]);
      
      setQuiz(quizResponse.data);
      setQuestions(questionsResponse.data);
      setTimeLeft(quizResponse.data.durationMinutes * 60);
    } catch (error) {
      setError('Error loading quiz');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;
    
    setSubmitting(true);
    const startTime = quiz.durationMinutes * 60;
    const timeTaken = startTime - timeLeft;

    try {
      const response = await quizAPI.submitQuiz({
        quizId: id, // Use string ID directly, not parseInt
        answers,
        timeTakenSeconds: timeTaken
      });
      
      navigate(`/result/${response.data.id}`);
    } catch (error) {
      setError('Error submitting quiz');
      setSubmitting(false);
    }
  }, [id, quiz, answers, timeLeft, navigate, submitting]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft, handleSubmitQuiz]);

  useEffect(() => {
    // Animate progress bar
    if (questions.length > 0) {
      setTimeout(() => setProgressAnimated(true), 300);
    }
  }, [currentQuestionIndex, questions.length]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answer) => {
    // Don't auto-advance, just save the answer and allow navigation
    setSelectedAnswer(answer);
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
    
    // Brief feedback without blocking navigation
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, 500);
  };

  const navigateToQuestion = (index) => {
    // Only prevent navigation during submission
    if (submitting) return;
    
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      setSelectedAnswer(answers[questions[index]?.id] || '');
      // Reset any feedback state
      setShowFeedback(false);
      // Reset progress animation for the new question
      setProgressAnimated(false);
      setTimeout(() => setProgressAnimated(true), 100);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeLeft / (quiz?.durationMinutes * 60)) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0;
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg animate-pulse">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <i className="fas fa-exclamation-triangle text-red-400 text-6xl mb-4"></i>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={() => navigate('/quizzes')}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mb-4 animate-bounce">
                <i className="fas fa-play text-3xl text-white"></i>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{quiz?.title}</h1>
              <p className="text-blue-200">{quiz?.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-4">
                <i className="fas fa-clock text-blue-300 text-2xl mb-2"></i>
                <p className="text-white text-sm">Duration</p>
                <p className="text-blue-200 font-bold">{quiz?.durationMinutes} minutes</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <i className="fas fa-question-circle text-green-300 text-2xl mb-2"></i>
                <p className="text-white text-sm">Questions</p>
                <p className="text-green-200 font-bold">{questions.length}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <i className="fas fa-star text-yellow-300 text-2xl mb-2"></i>
                <p className="text-white text-sm">Total Points</p>
                <p className="text-yellow-200 font-bold">{quiz?.totalMarks}</p>
              </div>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-400/50 rounded-lg p-4 mb-8">
              <div className="flex items-center justify-center text-yellow-300 mb-2">
                <i className="fas fa-info-circle mr-2"></i>
                <span className="font-semibold">Instructions</span>
              </div>
              <ul className="text-yellow-100 text-sm space-y-1 text-left max-w-md mx-auto">
                <li>• Read each question carefully</li>
                <li>• Select the best answer from the options</li>
                <li>• Navigate between questions using the question navigator</li>
                <li>• Submit manually when you're ready or time runs out</li>
                <li>• You can review and change answers before submitting</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center mx-auto"
            >
              <i className="fas fa-rocket mr-3"></i>
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      
      {/* Enhanced Header with Navigation */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-1 sm:space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-home mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/quizzes')}
                className="flex items-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-list mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Quizzes</span>
              </button>
              <button
                onClick={() => navigate('/history')}
                className="flex items-center px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <i className="fas fa-history mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">History</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Timer */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-black/20 ${getTimeColor()}`}>
                <i className="fas fa-clock"></i>
                <span className="font-mono text-lg font-bold">
                  {formatTime(timeLeft)}
                </span>
              </div>
              
              {/* Exit Button */}
              <button
                onClick={() => {
                  if (Object.keys(answers).length > 0) {
                    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
                      navigate('/quizzes');
                    }
                  } else {
                    navigate('/quizzes');
                  }
                }}
                className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 transform hover:scale-105"
                title="Exit Quiz"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          {/* Quiz Info Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Breadcrumb */}
              <div className="flex items-center text-white/60 text-sm">
                <span>Quizzes</span>
                <i className="fas fa-chevron-right mx-2"></i>
                <span className="text-white font-semibold">{quiz?.title}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`bg-gradient-to-r from-blue-400 to-green-400 h-2 rounded-full transition-all duration-1000 ease-out ${
                  progressAnimated ? 'transform scale-y-110' : ''
                }`}
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="text-white/60 text-sm mt-2">
              {Math.round(getProgressPercentage())}% Complete
            </p>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="transition-all duration-500 opacity-100 transform translate-x-0">
          
          {/* Question Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="text-white/60 text-sm">
                  {currentQuestion?.marks} {currentQuestion?.marks === 1 ? 'point' : 'points'}
                </span>
              </div>
              
              <h2 className="text-2xl font-semibold text-white leading-relaxed">
                {currentQuestion?.questionText}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="grid gap-4">
              {['A', 'B', 'C', 'D'].map((option, index) => {
                const optionText = currentQuestion?.[`option${option}`];
                const isSelected = selectedAnswer === option;
                const isCorrect = showFeedback && currentQuestion?.correctAnswer === option;
                const isWrong = showFeedback && isSelected && currentQuestion?.correctAnswer !== option;
                
                return optionText ? (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={submitting}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-300 transform hover:scale-102 ${
                      isCorrect 
                        ? 'border-green-400 bg-green-500/20 text-green-300' 
                        : isWrong 
                        ? 'border-red-400 bg-red-500/20 text-red-300'
                        : isSelected 
                        ? 'border-blue-400 bg-blue-500/20 text-blue-300' 
                        : 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20'
                    } ${submitting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center">
                      <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-4 font-bold text-sm ${
                        isCorrect 
                          ? 'border-green-400 bg-green-500 text-white' 
                          : isWrong 
                          ? 'border-red-400 bg-red-500 text-white'
                          : isSelected 
                          ? 'border-blue-400 bg-blue-500 text-white' 
                          : 'border-white/50'
                      }`}>
                        {isCorrect ? <i className="fas fa-check"></i> : 
                         isWrong ? <i className="fas fa-times"></i> : option}
                      </span>
                      <span className="flex-1">{optionText}</span>
                      {isSelected && !showFeedback && (
                        <i className="fas fa-arrow-right text-blue-300 ml-4"></i>
                      )}
                    </div>
                  </button>
                ) : null;
              })}
            </div>
          </div>

          {/* Question Navigator */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <i className="fas fa-map mr-2"></i>
              Question Navigator
            </h3>
            <div className="grid grid-cols-10 gap-1">
              {questions.map((_, index) => {
                const isAnswered = answers[questions[index]?.id];
                const isCurrent = index === currentQuestionIndex;
                const isDisabled = submitting; // Only disable during submission
                
                return (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    disabled={isDisabled}
                    title={`Question ${index + 1}${isAnswered ? ' (Answered)' : ''}${isCurrent ? ' (Current)' : ''}`}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all duration-300 relative active:scale-95 ${
                      isCurrent 
                        ? 'bg-blue-500 text-white ring-2 ring-blue-300 shadow-lg' 
                        : isAnswered 
                        ? 'bg-green-500/50 text-green-300 hover:bg-green-500/70 hover:scale-110' 
                        : 'bg-white/20 text-white/60 hover:bg-white/30 hover:scale-105'
                    } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'}`}
                  >
                    {isAnswered && !isCurrent && (
                      <i className="fas fa-check absolute -top-1 -right-1 text-xs text-green-400 bg-white rounded-full w-3 h-3 flex items-center justify-center"></i>
                    )}
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500/50 rounded mr-1"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-white/20 rounded mr-1"></div>
                  <span>Unanswered</span>
                </div>
              </div>
              <div className="text-right">
                {Object.keys(answers).length}/{questions.length} answered
              </div>
            </div>
          </div>

          {/* Quiz Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0 || submitting}
                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white disabled:text-white/40 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left mr-2"></i>
                Previous
              </button>
              
              <button
                onClick={() => navigateToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === questions.length - 1 || submitting}
                className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white disabled:text-white/40 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              >
                Next
                <i className="fas fa-chevron-right ml-2"></i>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {Object.keys(answers).length === questions.length && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg"
                >
                  <i className="fas fa-check mr-2"></i>
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Modal */}
      {submitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Submitting your quiz...</p>
            <p className="text-white/60 text-sm mt-2">Please wait while we process your answers</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
