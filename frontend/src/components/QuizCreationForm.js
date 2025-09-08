import React, { useState } from 'react';
import { adminAPI } from '../services/api';

const QuizCreationForm = ({ onQuizCreated, onClose, editingQuiz }) => {
  const [formData, setFormData] = useState({
    title: editingQuiz?.title || '',
    description: editingQuiz?.description || '',
    durationMinutes: editingQuiz?.durationMinutes || 30,
    isActive: editingQuiz?.isActive !== undefined ? editingQuiz.isActive : true
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

    if (!formData.title.trim()) {
      newErrors.title = 'Quiz title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Quiz title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Quiz description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Quiz description must be at least 10 characters';
    }

    if (!formData.durationMinutes || formData.durationMinutes < 1) {
      newErrors.durationMinutes = 'Duration must be at least 1 minute';
    } else if (formData.durationMinutes > 300) {
      newErrors.durationMinutes = 'Duration cannot exceed 300 minutes (5 hours)';
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
      
      const quizData = {
        ...formData,
        durationMinutes: parseInt(formData.durationMinutes)
      };

      let response;
      if (editingQuiz) {
        response = await adminAPI.updateQuiz(editingQuiz.id, quizData);
      } else {
        response = await adminAPI.createQuiz(quizData);
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        durationMinutes: 30,
        isActive: true
      });

      if (onQuizCreated) {
        onQuizCreated(response.data);
      }

      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error(`Error ${editingQuiz ? 'updating' : 'creating'} quiz:`, error);
      setErrors({ submit: `Error ${editingQuiz ? 'updating' : 'creating'} quiz. Please try again.` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-lg shadow-sm">
      {/* Simple Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
        <h2 className="text-lg font-semibold">
          {editingQuiz ? 'Edit Quiz' : 'New Quiz'}
        </h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Quiz title"
              required
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows="3"
              placeholder="Quiz description"
              required
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes) *</label>
            <input
              type="number"
              name="durationMinutes"
              value={formData.durationMinutes}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="1"
              max="300"
              required
            />
            {errors.durationMinutes && <p className="text-red-500 text-xs mt-1">{errors.durationMinutes}</p>}
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm">Active (visible to users)</span>
            </label>
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
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingQuiz ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreationForm;
