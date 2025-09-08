import axios from 'axios';

// Use relative URLs in development, absolute URLs in production
// Make sure to update these URLs to match your actual deployed backend URL
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://quiz-app-backend.onrender.com/api' 
  : '/api';
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://quiz-app-backend.onrender.com' 
  : '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
});

// Create a separate instance for public endpoints (no auth required)
const publicApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    // Check if this is an admin API call
    if (config.url && config.url.includes('/admin/')) {
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      // Use regular user token for non-admin calls
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Check if this was an admin API call
      if (error.config.url && error.config.url.includes('/admin/')) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = '/admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Add a function to test the API connection
export const testApiConnection = async () => {
  try {
    const response = await publicApi.get('/actuator/health');
    return response.data;
  } catch (error) {
    console.error('API connection test failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Quiz API
export const quizAPI = {
  getAvailableQuizzes: () => publicApi.get('/public/quiz/available'),
  getAllQuizzes: () => publicApi.get('/public/quiz/all'),
  getQuiz: (id) => publicApi.get(`/public/quiz/${id}`),
  getQuizQuestions: (id) => publicApi.get(`/public/quiz/${id}/questions`),
  submitQuiz: (submission) => {
    // Add username to submission for public endpoint
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const submissionWithUser = { ...submission, username: user.username };
    return publicApi.post('/public/quiz/submit', submissionWithUser);
  },
  getQuizResult: (id) => publicApi.get(`/public/quiz/result/${id}`),
  getResult: (id) => publicApi.get(`/public/quiz/result/${id}`),
  getUserHistory: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return publicApi.get(`/public/quiz/user/${user.username}/history`);
  },
  getUserHistorySummary: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return publicApi.get(`/public/quiz/user/${user.username}/history/summary`);
  },
  getUserResults: () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return publicApi.get(`/public/quiz/user/${user.username}/history`);
  },
  getLeaderboard: (quizId) => api.get(`/quiz/leaderboard${quizId ? `?quizId=${quizId}` : ''}`),
};

// Admin API
export const adminAPI = {
  // Admin Authentication
  adminLogin: (credentials) => api.post('/admin/auth/login', credentials),
  verifyAdminToken: () => api.get('/admin/auth/verify'),
  adminLogout: () => api.post('/admin/auth/logout'),
  adminRegister: (registrationData) => api.post('/admin/register', registrationData),
  
  // Dashboard stats
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  
  // Quiz Management
  createQuiz: (quizData) => api.post('/admin/quizzes', quizData),
  updateQuiz: (id, quizData) => api.put(`/admin/quizzes/${id}`, quizData),
  deleteQuiz: (id) => api.delete(`/admin/quizzes/${id}`),
  getAllQuizzes: () => api.get('/admin/quizzes'),
  
  // Question Management
  createQuestion: (questionData) => api.post('/admin/questions', questionData),
  updateQuestion: (id, questionData) => api.put(`/admin/questions/${id}`, questionData),
  deleteQuestion: (id) => api.delete(`/admin/questions/${id}`),
  getQuestionsByQuiz: (quizId) => api.get(`/admin/quizzes/${quizId}/questions`),
  getQuizQuestions: (quizId) => api.get(`/admin/quiz/${quizId}/questions`),
  
  // User management
  getAllUsers: () => api.get('/admin/users'),
  getAllUsersWithStats: () => api.get('/admin/users/detailed'),
  updateUserRole: (id, role) => api.put(`/admin/user/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/user/${id}`),
  
  // Results management
  getAllResults: () => api.get('/admin/results'),
  getUserResults: (userId) => api.get(`/admin/user/${userId}/results`),
  deleteResult: (id) => api.delete(`/admin/result/${id}`),
  
  // Reports
  getUserActivityReport: () => api.get('/admin/reports/user-activity'),
  getQuizPerformanceReport: () => api.get('/admin/reports/quiz-performance'),
  getRecentActivityReport: (days = 7) => api.get(`/admin/reports/recent-activity?days=${days}`),
};

// Leaderboard API - Using public endpoints (no authentication required)
export const leaderboardAPI = {
  getGlobalLeaderboard: (limit = 50) => publicApi.get(`/leaderboard/global?limit=${limit}`),
  getQuizLeaderboard: (quizId, limit = 20) => publicApi.get(`/leaderboard/quiz/${quizId}?limit=${limit}`),
  getTopPerformers: (limit = 20) => publicApi.get(`/leaderboard/top-performers?limit=${limit}`),
  getWeeklyLeaderboard: (limit = 20) => publicApi.get(`/leaderboard/weekly?limit=${limit}`),
  getMonthlyLeaderboard: (limit = 20) => publicApi.get(`/leaderboard/monthly?limit=${limit}`),
  getRecentTopScores: (days = 7, limit = 20) => publicApi.get(`/leaderboard/recent?days=${days}&limit=${limit}`),
  getMyRanking: (username) => publicApi.get(`/leaderboard/my-ranking/${username}`),
  getMyPersonalRanking: (username) => publicApi.get(`/leaderboard/my-personal-ranking/${username}`),
  getLeaderboardStats: () => publicApi.get('/leaderboard/stats'),
};

export default api;