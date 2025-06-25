const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// @desc    Get tasks for logged in user (or all tasks for manager)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let tasks;

  // If user is manager, get all tasks, otherwise only get assigned tasks
  if (req.user.role === 'manager') {
    tasks = await Task.find()
      .populate({
        path: 'assignedTo',
        select: 'name email'
      })
      .populate({
        path: 'createdBy',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
  } else {
    tasks = await Task.find({ assignedTo: req.user._id })
      .populate({
        path: 'createdBy',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
  }

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate({
      path: 'assignedTo',
      select: 'name email'
    })
    .populate({
      path: 'createdBy',
      select: 'name email'
    });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user has permission to view this task
  if (
    req.user.role !== 'manager' &&
    task.assignedTo._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to view this task');
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private (manager only)
const createTask = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user._id;

  // Check if the user is a manager
  if (req.user.role !== 'manager') {
    res.status(403);
    throw new Error('Only managers can create tasks');
  }

  // Check if assigned user exists
  const user = await User.findById(req.body.assignedTo);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check ownership or manager status
  if (
    req.user.role !== 'manager' &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorized to update this task');
  }

  // Regular users can only update the status
  if (req.user.role !== 'manager') {
    // Only allow status updates for regular users
    const allowedUpdates = ['status'];
    const requestedUpdates = Object.keys(req.body);
    const isValidOperation = requestedUpdates.every(update => 
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      res.status(400);
      throw new Error('Regular users can only update task status');
    }
  } else {
    // If assignedTo is being changed, verify the user exists
    if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo.toString()) {
      const user = await User.findById(req.body.assignedTo);
      if (!user) {
        res.status(404);
        throw new Error('Assigned user not found');
      }
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' }
  ]);

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (manager only)
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check if user is manager
  if (req.user.role !== 'manager') {
    res.status(403);
    throw new Error('Only managers can delete tasks');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  // Validate status param
  const validStatuses = ['à faire', 'en cours', 'terminée'];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }
  
  let tasks;
  
  if (req.user.role === 'manager') {
    tasks = await Task.find({ status })
      .populate({
        path: 'assignedTo',
        select: 'name email'
      })
      .populate({
        path: 'createdBy',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
  } else {
    tasks = await Task.find({ 
      assignedTo: req.user._id,
      status 
    })
      .populate({
        path: 'createdBy',
        select: 'name email'
      })
      .sort({ createdAt: -1 });
  }
  
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTasksByStatus
};
