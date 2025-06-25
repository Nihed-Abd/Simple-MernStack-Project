const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes protected
router.use(protect);

// Routes for all authenticated users
router.get('/', getTasks);
router.get('/status/:status', getTasksByStatus);
router.get('/:id', getTask);
router.put('/:id', updateTask);

// Routes only for managers
router.post('/', authorize('manager'), createTask);
router.delete('/:id', authorize('manager'), deleteTask);

module.exports = router;
