import api from './api';

const USER_URL = '/users';

// Get all users (manager only)
const getUsers = async () => {
  const response = await api.get(USER_URL);
  return response.data;
};

// Get user by ID (manager only)
const getUserById = async (userId) => {
  const response = await api.get(`${USER_URL}/${userId}`);
  return response.data;
};

// Create new user (manager only)
const createUser = async (userData) => {
  const response = await api.post(USER_URL, userData);
  return response.data;
};

// Update user (manager only)
const updateUser = async (userId, userData) => {
  const response = await api.put(`${USER_URL}/${userId}`, userData);
  return response.data;
};

// Delete user (manager only)
const deleteUser = async (userId) => {
  const response = await api.delete(`${USER_URL}/${userId}`);
  return response.data;
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default userService;
