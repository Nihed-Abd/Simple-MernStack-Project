import api from './api';

const TASK_URL = '/tasks';

// Get all tasks (filtered by user role)
const getTasks = async () => {
  const response = await api.get(TASK_URL);
  return response.data;
};

// Get task by ID
const getTask = async (taskId) => {
  const response = await api.get(`${TASK_URL}/${taskId}`);
  return response.data;
};

// Create new task
const createTask = async (taskData) => {
  const response = await api.post(TASK_URL, taskData);
  return response.data;
};

// Update task
const updateTask = async (taskId, taskData) => {
  const response = await api.put(`${TASK_URL}/${taskId}`, taskData);
  return response.data;
};

// Delete task
const deleteTask = async (taskId) => {
  const response = await api.delete(`${TASK_URL}/${taskId}`);
  return response.data;
};

// Get tasks by status
const getTasksByStatus = async (status) => {
  const response = await api.get(`${TASK_URL}/status/${status}`);
  return response.data;
};

const taskService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus
};

export default taskService;
