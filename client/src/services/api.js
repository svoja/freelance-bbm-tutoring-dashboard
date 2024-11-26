import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scheduleService = {
  // Get all schedule data
  getSchedule: async () => {
    const response = await api.get('/schedule');
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await api.get('/schedule/stats');
    return response.data;
  },

  // Get student schedule
  getStudentSchedule: async (studentId) => {
    const response = await api.get(`/schedule/student/${studentId}`);
    return response.data;
  },

  // Get teacher schedule
  getTeacherSchedule: async (teacherId) => {
    const response = await api.get(`/schedule/teacher/${teacherId}`);
    return response.data;
  }
};

// Add error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;