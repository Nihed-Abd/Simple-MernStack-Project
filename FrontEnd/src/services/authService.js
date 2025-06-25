import api from './api';

const AUTH_URL = '/auth';

// Register user
const register = async (userData) => {
  const response = await api.post(`${AUTH_URL}/register`, userData);
  if (response.data) {
    localStorage.setItem('teamtask_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await api.post(`${AUTH_URL}/login`, userData);
  if (response.data) {
    localStorage.setItem('teamtask_user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('teamtask_user');
};

// Get current user profile
const getCurrentUser = async () => {
  const response = await api.get(`${AUTH_URL}/me`);
  return response.data;
};

// Check if token is valid
const validateToken = async () => {
  try {
    const response = await api.get(`${AUTH_URL}/me`);
    return response.data;
  } catch (error) {
    return null;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  validateToken
};

export default authService;
