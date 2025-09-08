import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import QuestionForm from '../components/QuestionForm';
import QuizSummary from './QuizSummary';
import QuizCreationForm from './QuizCreationForm';

const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    durationMinutes: 30
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz.id);
    }
  }, [selectedQuiz]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllQuizzes();
      setQuizzes(response.data);
    } catch (error) {
      setError('Error fetching quizzes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (quizId) => {
    try {
      const response = await adminAPI.getQuestionsByQuiz(quizId);
      setQuestions(response.data);
    } catch (error) {
      setError('Error fetching questions');
      console.error('Error:', error);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await adminAPI.createQuiz(quizFormData);
      setQuizzes([...quizzes, response.data]);
      setQuizFormData({ title: '', description: '', durationMinutes: 30 });
      setShowQuizForm(false);
    } catch (error) {
      setError('Error creating quiz');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuiz = (quiz) => {
    setQuizFormData({
      title: quiz.title,
      description: quiz.description,
      durationMinutes: quiz.durationMinutes
    });
    setSelectedQuiz(quiz);
    setShowQuizForm(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz? This will also delete all questions in it.')) {
      try {
        await adminAPI.deleteQuiz(quizId);
        setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        if (selectedQuiz && selectedQuiz.id === quizId) {
          setSelectedQuiz(null);
          setQuestions([]);
        }
      } catch (error) {
        setError('Error deleting quiz');
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await adminAPI.deleteQuestion(questionId);
        setQuestions(questions.filter(q => q.id !== questionId));
        // Update quiz total marks
        if (selectedQuiz) {
          fetchQuizzes();
        }
      } catch (error) {
        setError('Error deleting question');
        console.error('Error:', error);
      }
    }
  };

  const handleQuestionAdded = () => {
    if (selectedQuiz) {
      fetchQuestions(selectedQuiz.id);
      fetchQuizzes(); // Refresh to update total marks
    }
    setShowQuestionForm(false);
    setEditingQuestion(null);
  };

  return (
    <div className="p-4">
      {/* Simple Header */}
      <div className="bg-white border rounded-lg shadow-sm mb-4">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Quiz Management</h1>
            <button
              onClick={() => {
                setSelectedQuiz(null);
                setShowQuizForm(true);
              }}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              New Quiz
            </button>
          </div>
        </div>
        
        {/* Simple Stats */}
        <div className="p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-800">{quizzes.length}</div>
            <div className="text-sm text-gray-600">Total Quizzes</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">{questions.length}</div>
            <div className="text-sm text-gray-600">Questions</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">{selectedQuiz?.totalMarks || 0}</div>
            <div className="text-sm text-gray-600">Total Marks</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quiz List */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg shadow-sm">
            <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
              <h3 className="font-semibold">Quizzes ({quizzes.length})</h3>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-4">
                  <div className="text-gray-500">Loading...</div>
                </div>
              ) : quizzes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No quizzes created yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quizzes.map((quiz) => (
                    <QuizSummary
                      key={quiz.id}
                      quiz={quiz}
                      onEdit={() => handleEditQuiz(quiz)}
                      onAddQuestion={() => {
                        setSelectedQuiz(quiz);
                        setShowQuestionForm(true);
                      }}
                      onDelete={handleDeleteQuiz}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Questions Management */}
        <div className="lg:col-span-2">
          {selectedQuiz ? (
            <div className="space-y-4">
              {/* Quiz Header */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{selectedQuiz.title}</h3>
                      <p className="text-green-100 text-sm">{selectedQuiz.description}</p>
                    </div>
                    <button
                      onClick={() => setShowQuestionForm(true)}
                      className="px-3 py-1 bg-white text-green-600 rounded text-sm hover:bg-gray-100"
                    >
                      Add Question
                    </button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{questions.length}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{selectedQuiz.totalMarks}</div>
                    <div className="text-sm text-gray-600">Total Marks</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">{selectedQuiz.durationMinutes}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                </div>
              </div>

              {/* Questions List */}
              <div className="bg-white border rounded-lg shadow-sm">
                <div className="bg-purple-600 text-white px-4 py-3 rounded-t-lg">
                  <h3 className="font-semibold">Questions</h3>
                </div>
                <div className="p-4">
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-2">No questions added yet</p>
                      <button
                        onClick={() => setShowQuestionForm(true)}
                        className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
                      >
                        Add First Question
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {questions.map((question, index) => (
                        <div key={question.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="bg-blue-600 text-white rounded w-6 h-6 flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-800 mb-2">
                                  {question.questionText}
                                </h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  {['A', 'B', 'C', 'D'].map((option) => (
                                    <div
                                      key={option}
                                      className={`p-2 border rounded ${
                                        question.correctAnswer === option
                                          ? 'bg-green-50 border-green-300 text-green-800'
                                          : 'bg-gray-50 border-gray-200'
                                      }`}
                                    >
                                      <strong>{option}:</strong> {question[`option${option}`]}
                                      {question.correctAnswer === option && (
                                        <span className="ml-1 text-green-600">✓</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                                {question.marks} pt{question.marks !== 1 ? 's' : ''}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingQuestion(question);
                                  setShowQuestionForm(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg shadow-sm">
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg mb-2">Select a quiz to manage questions</p>
                <p className="text-sm">Choose a quiz from the left panel</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quiz Form Modal */}
      {showQuizForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <QuizCreationForm
            onQuizCreated={(updatedQuiz) => {
              if (selectedQuiz) {
                setQuizzes(quizzes.map(q => q.id === selectedQuiz.id ? updatedQuiz : q));
                setSelectedQuiz(null);
              } else {
                setQuizzes([...quizzes, updatedQuiz]);
              }
              setShowQuizForm(false);
              setQuizFormData({ title: '', description: '', durationMinutes: 30 });
            }}
            onClose={() => {
              setShowQuizForm(false);
              setSelectedQuiz(null);
              setQuizFormData({ title: '', description: '', durationMinutes: 30 });
            }}
            editingQuiz={selectedQuiz && showQuizForm ? selectedQuiz : null}
          />
        </div>
      )}

      {/* Question Form Modal */}
      {showQuestionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <QuestionForm
            quizId={selectedQuiz.id}
            existingQuestion={editingQuestion}
            onQuestionAdded={handleQuestionAdded}
            onClose={() => {
              setShowQuestionForm(false);
              setEditingQuestion(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuizManagement;
