import React, { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../services/api';

const QuizSummary = ({ quiz, onEdit, onAddQuestion, onDelete }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const fetchQuestions = useCallback(async () => {
    if (!quiz?.id) return;
    try {
      setLoading(true);
      const response = await adminAPI.getQuestionsByQuiz(quiz.id);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  }, [quiz?.id]);

  useEffect(() => {
    if (quiz && showDetails) {
      fetchQuestions();
    }
  }, [quiz, showDetails, fetchQuestions]);

  const calculateQuizStats = () => {
    const totalQuestions = questions.length;
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);
    const avgMarksPerQuestion = totalQuestions > 0 ? (totalMarks / totalQuestions).toFixed(1) : 0;
    
    const correctAnswerDistribution = questions.reduce((acc, q) => {
      const answer = q.correctAnswer;
      acc[answer] = (acc[answer] || 0) + 1;
      return acc;
    }, {});

    return {
      totalQuestions,
      totalMarks,
      avgMarksPerQuestion,
      correctAnswerDistribution
    };
  };

  const stats = calculateQuizStats();

  const getDifficultyLevel = () => {
    if (stats.avgMarksPerQuestion <= 1) return { level: 'Easy', color: 'text-green-600', bg: 'bg-green-100' };
    if (stats.avgMarksPerQuestion <= 2) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Hard', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const difficulty = getDifficultyLevel();

  return (
    <div className="quiz-card">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-4 rounded-t-xl">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{quiz.title}</h3>
            <p className="text-indigo-100 mt-1">{quiz.description}</p>
          </div>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={onEdit}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-colors"
              title="Edit Quiz"
            >
              <i className="fas fa-edit"></i>
            </button>
            <button
              onClick={onAddQuestion}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-colors"
              title="Add Question"
            >
              <i className="fas fa-plus"></i>
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete "${quiz.title}"? This will also delete all questions in it.`)) {
                    onDelete(quiz.id);
                  }
                }}
                className="bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-100 px-3 py-2 rounded-lg transition-colors"
                title="Delete Quiz"
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Questions */}
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {stats.totalQuestions}
            </div>
            <div className="text-sm font-medium text-blue-800">Questions</div>
            <div className="text-xs text-blue-600 mt-1">
              {stats.totalQuestions === 0 ? 'No questions yet' : 'Total count'}
            </div>
          </div>

          {/* Total Marks */}
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {stats.totalMarks}
            </div>
            <div className="text-sm font-medium text-green-800">Total Marks</div>
            <div className="text-xs text-green-600 mt-1">
              {stats.totalMarks === 0 ? 'Add questions' : 'Maximum score'}
            </div>
          </div>

          {/* Duration */}
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-600 mb-1">
              {quiz.durationMinutes}
            </div>
            <div className="text-sm font-medium text-yellow-800">Minutes</div>
            <div className="text-xs text-yellow-600 mt-1">
              Time limit
            </div>
          </div>

          {/* Difficulty */}
          <div className={`text-center p-4 ${difficulty.bg} rounded-lg border border-opacity-50`}>
            <div className={`text-3xl font-bold ${difficulty.color} mb-1`}>
              {stats.avgMarksPerQuestion}
            </div>
            <div className={`text-sm font-medium ${difficulty.color}`}>Avg Marks</div>
            <div className={`text-xs ${difficulty.color} mt-1`}>
              {difficulty.level}
            </div>
          </div>
        </div>

        {/* Quiz Status and Settings */}
        <div className="flex flex-wrap items-center justify-between mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                quiz.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {quiz.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Created:</span>
              <span className="text-gray-800 font-medium">
                {new Date(quiz.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-outline text-sm"
          >
            <i className={`fas ${showDetails ? 'fa-eye-slash' : 'fa-eye'} mr-2`}></i>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Detailed Question Breakdown */}
        {showDetails && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              <i className="fas fa-list-alt mr-2"></i>
              Question Breakdown
            </h4>

            {loading ? (
              <div className="text-center py-4">
                <i className="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
                <p className="text-gray-500 mt-2">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <i className="fas fa-question-circle text-4xl mb-3"></i>
                <p className="text-lg mb-2">No questions added yet</p>
                <p className="text-sm">Start by adding your first question to this quiz</p>
                <button
                  onClick={onAddQuestion}
                  className="btn-primary mt-4"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add First Question
                </button>
              </div>
            ) : (
              <>
                {/* Answer Distribution */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-3">
                    <i className="fas fa-chart-pie mr-2"></i>
                    Correct Answer Distribution
                  </h5>
                  <div className="grid grid-cols-4 gap-2">
                    {['A', 'B', 'C', 'D'].map(option => (
                      <div key={option} className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats.correctAnswerDistribution[option] || 0}
                        </div>
                        <div className="text-sm text-blue-700">Option {option}</div>
                        <div className="text-xs text-blue-500">
                          {stats.totalQuestions > 0 
                            ? Math.round(((stats.correctAnswerDistribution[option] || 0) / stats.totalQuestions) * 100)
                            : 0
                          }%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="bg-indigo-100 text-indigo-800 rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-800 mb-2">
                              {question.questionText}
                            </h6>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                <i className="fas fa-star mr-1"></i>
                                {question.marks} mark{question.marks !== 1 ? 's' : ''}
                              </span>
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                <i className="fas fa-check mr-1"></i>
                                Answer: {question.correctAnswer}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Show correct answer text */}
                      <div className="ml-11 mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                        <strong>Correct Answer ({question.correctAnswer}):</strong> {question[`option${question.correctAnswer}`]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Stats */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">
                    <i className="fas fa-calculator mr-2"></i>
                    Quiz Statistics Summary
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Questions:</span>
                      <span className="ml-2 font-semibold">{stats.totalQuestions}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="ml-2 font-semibold">{stats.totalMarks}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Average Marks per Question:</span>
                      <span className="ml-2 font-semibold">{stats.avgMarksPerQuestion}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Estimated completion time: {Math.ceil(stats.totalQuestions * 1.5)} - {Math.ceil(stats.totalQuestions * 2)} minutes
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSummary;
