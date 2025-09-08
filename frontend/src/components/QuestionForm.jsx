import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';

const QuestionForm = ({ quizId, onQuestionAdded, onClose, existingQuestion = null }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    marks: 1,
    quizId: quizId
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingQuestion) {
      setFormData({
        questionText: existingQuestion.questionText || '',
        optionA: existingQuestion.optionA || '',
        optionB: existingQuestion.optionB || '',
        optionC: existingQuestion.optionC || '',
        optionD: existingQuestion.optionD || '',
        correctAnswer: existingQuestion.correctAnswer || '',
        marks: existingQuestion.marks || 1,
        quizId: quizId
      });
    }
  }, [existingQuestion, quizId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    }
    
    if (!formData.optionA.trim()) {
      newErrors.optionA = 'Option A is required';
    }
    
    if (!formData.optionB.trim()) {
      newErrors.optionB = 'Option B is required';
    }
    
    if (!formData.optionC.trim()) {
      newErrors.optionC = 'Option C is required';
    }
    
    if (!formData.optionD.trim()) {
      newErrors.optionD = 'Option D is required';
    }
    
    if (!formData.correctAnswer) {
      newErrors.correctAnswer = 'Please select the correct answer';
    }
    
    if (!formData.marks || formData.marks < 1) {
      newErrors.marks = 'Marks must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      if (existingQuestion) {
        await adminAPI.updateQuestion(existingQuestion.id, formData);
      } else {
        await adminAPI.createQuestion(formData);
      }
      
      // Reset form
      setFormData({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: '',
        marks: 1,
        quizId: quizId
      });
      
      if (onQuestionAdded) {
        onQuestionAdded();
      }
      
      if (onClose) {
        onClose();
      }
      
    } catch (error) {
      console.error('Error saving question:', error);
      setErrors({ submit: 'Error saving question. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-lg shadow-sm">
      {/* Simple Header */}
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-lg">
        <h2 className="text-lg font-semibold">
          {existingQuestion ? 'Edit Question' : 'Add Question'}
        </h2>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Text */}
          <div>
            <label className="block text-sm font-medium mb-1">Question *</label>
            <textarea
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              rows="3"
              placeholder="Enter your question"
              required
            />
            {errors.questionText && <p className="text-red-500 text-xs mt-1">{errors.questionText}</p>}
          </div>

          {/* Answer Options */}
          <div>
            <label className="block text-sm font-medium mb-2">Answer Options *</label>
            <div className="space-y-3">
              {/* Option A */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="A"
                  checked={formData.correctAnswer === 'A'}
                  onChange={handleChange}
                  className="text-green-600"
                />
                <label className="text-sm font-medium w-8">A.</label>
                <input
                  type="text"
                  name="optionA"
                  value={formData.optionA}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="Option A"
                  required
                />
              </div>
              {errors.optionA && <p className="text-red-500 text-xs ml-10">{errors.optionA}</p>}

              {/* Option B */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="B"
                  checked={formData.correctAnswer === 'B'}
                  onChange={handleChange}
                  className="text-green-600"
                />
                <label className="text-sm font-medium w-8">B.</label>
                <input
                  type="text"
                  name="optionB"
                  value={formData.optionB}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="Option B"
                  required
                />
              </div>
              {errors.optionB && <p className="text-red-500 text-xs ml-10">{errors.optionB}</p>}

              {/* Option C */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="C"
                  checked={formData.correctAnswer === 'C'}
                  onChange={handleChange}
                  className="text-green-600"
                />
                <label className="text-sm font-medium w-8">C.</label>
                <input
                  type="text"
                  name="optionC"
                  value={formData.optionC}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="Option C"
                  required
                />
              </div>
              {errors.optionC && <p className="text-red-500 text-xs ml-10">{errors.optionC}</p>}

              {/* Option D */}
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  value="D"
                  checked={formData.correctAnswer === 'D'}
                  onChange={handleChange}
                  className="text-green-600"
                />
                <label className="text-sm font-medium w-8">D.</label>
                <input
                  type="text"
                  name="optionD"
                  value={formData.optionD}
                  onChange={handleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="Option D"
                  required
                />
              </div>
              {errors.optionD && <p className="text-red-500 text-xs ml-10">{errors.optionD}</p>}
            </div>
            {errors.correctAnswer && <p className="text-red-500 text-xs mt-1">{errors.correctAnswer}</p>}
          </div>

          {/* Points */}
          <div className="w-24">
            <label className="block text-sm font-medium mb-1">Points *</label>
            <input
              type="number"
              name="marks"
              value={formData.marks}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              min="1"
              max="10"
              required
            />
            {errors.marks && <p className="text-red-500 text-xs mt-1">{errors.marks}</p>}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (existingQuestion ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionForm;
