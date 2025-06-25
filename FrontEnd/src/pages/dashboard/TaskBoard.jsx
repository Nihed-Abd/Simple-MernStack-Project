import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiFilter, FiSearch, FiPlus, FiGrid } from 'react-icons/fi';
import { Link } from 'react-router-dom';

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
    <div className="tasks-list-container p-6 animate-fade-in">
      <div className="tasks-list-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="header-left mb-4 md:mb-0">
          <h1 className="tasks-list-title flex items-center text-2xl font-bold text-gray-800 dark:text-white mb-2">
            <FiGrid className="mr-2 text-blue-600 dark:text-blue-400" /> Task Board
          </h1>
          <p className="tasks-list-subtitle text-gray-600 dark:text-gray-300">Manage your tasks visually with drag and drop</p>
        </div>
        <div className="header-right">
          <Link to="/tasks/new" className="btn-primary inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-colors">
            <FiPlus className="mr-2" /> New Task
          </Link>
        </div>
      </div>

      <div className="filters-panel bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="filters-form flex flex-col md:flex-row gap-4">
          <div className="search-container relative flex-1">
            <FiSearch className="search-icon absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="search-input w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options flex items-center">
            <div className="filter-group flex items-center">
              <label className="filter-label flex items-center mr-2 text-gray-700 dark:text-gray-300">
                <FiFilter className="mr-1" /> Status:
              </label>
              <select
                className="filter-select px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
        <div className="loading-container flex items-center justify-center h-64">
          <div className="spinner h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-gray-200 border-l-gray-200 border-r-gray-200 animate-spin"></div>
        </div>
      ) : (
        <div className="task-board grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statusColumns.map(column => (
            <div key={column.id} className={`task-column bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-t-4 ${column.id === 'backlog' ? 'border-gray-500 dark:border-gray-400' : column.id === 'in-progress' ? 'border-blue-500 dark:border-blue-400' : column.id === 'review' ? 'border-yellow-500 dark:border-yellow-400' : 'border-green-500 dark:border-green-400'}`}>
              <div className="column-header bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
                <h3 className="column-title flex items-center justify-between text-gray-800 dark:text-white font-medium">
                  {column.title}
                  <span className="task-count ml-2 px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200">{getTasksForColumn(column.id).length}</span>
                </h3>
              </div>
              <div className="column-content p-3 space-y-3 max-h-[70vh] overflow-y-auto">
                {getTasksForColumn(column.id).map(task => (
                  <div 
                    key={task._id}
                    className="task-card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transform transition-all duration-200 overflow-hidden"
                  >
                    <Link to={`/tasks/${task._id}`} className="block h-full">
                      <div className="task-card-header p-2 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <span className={`badge px-2 py-0.5 rounded-full text-xs font-medium ${task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}`}>
                          {task.priority || 'normal'}
                        </span>
                      </div>
                      <div className="task-card-body p-3">
                        <h4 className="task-title font-medium text-gray-800 dark:text-white mb-2">{task.title}</h4>
                        <p className="task-description text-sm text-gray-600 dark:text-gray-300">
                          {task.description?.substring(0, 80) || 'No description'}
                          {task.description?.length > 80 && '...'}
                        </p>
                      </div>
                      <div className="task-card-footer p-2 pt-0 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-xs">
                        <div className="task-assignee flex items-center">
                          <div className="assignee-avatar w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium mr-2">
                            {task.assignedTo?.name?.charAt(0) || 'U'}
                          </div>
                          <span className="assignee-name text-gray-600 dark:text-gray-300 truncate">{task.assignedTo?.name || 'Unassigned'}</span>
                        </div>
                        <div className="task-due-date text-gray-500 dark:text-gray-400">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
                {getTasksForColumn(column.id).length === 0 && (
                  <div className="empty-column py-8 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
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
