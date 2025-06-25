import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiSearch, FiPlus, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Redux actions
import { getTasks } from '../../features/tasks/taskSlice';

const TaskBoard = () => {
  const dispatch = useDispatch();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Status columns
  const statusColumns = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'completed', title: 'Completed' }
  ];

  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  // Filter tasks based on search term and status
  const filterTasks = () => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  // Get tasks for a specific column
  const getTasksForColumn = (columnId) => {
    return filterTasks().filter(task => task.status === columnId);
  };

  return (
    <div className="tasks-list-container">
      <div className="tasks-list-header">
        <div className="header-left">
          <h1 className="tasks-list-title">
            <FiGrid className="title-icon" /> Task Board
          </h1>
          <p className="tasks-list-subtitle">Manage your tasks visually with drag and drop</p>
        </div>
        <div className="header-right">
          <Link to="/tasks/new" className="btn btn-primary">
            <FiPlus /> New Task
          </Link>
        </div>
      </div>

      <div className="filters-panel">
        <div className="filters-form">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <div className="filter-group">
              <label className="filter-label">
                <FiFilter /> Status:
              </label>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Tasks</option>
                <option value="backlog">Backlog</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <div className="task-board">
          {statusColumns.map(column => (
            <div key={column.id} className={`task-column ${column.id}`}>
              <div className="column-header">
                <h3 className="column-title">
                  {column.title}
                  <span className="task-count">{getTasksForColumn(column.id).length}</span>
                </h3>
              </div>
              <div className="column-content">
                {getTasksForColumn(column.id).map(task => (
                  <motion.div 
                    key={task._id}
                    className="task-card"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to={`/tasks/${task._id}`} className="task-card-link">
                      <div className="task-card-header">
                        <span className={`badge badge-${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="task-card-body">
                        <h4 className="task-title">{task.title}</h4>
                        <p className="task-description">
                          {task.description.substring(0, 80)}
                          {task.description.length > 80 && '...'}
                        </p>
                      </div>
                      <div className="task-card-footer">
                        <div className="task-assignee">
                          <div className="assignee-avatar">
                            {task.assignedTo?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="assignee-name">{task.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                        <div className="task-due-date">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
                {getTasksForColumn(column.id).length === 0 && (
                  <div className="empty-column">
                    <p>No tasks in this column</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
