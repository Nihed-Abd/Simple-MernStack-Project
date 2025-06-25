import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, filterTasks } from '../../features/tasks/taskSlice';
import { logout } from '../../features/auth/authSlice';
import { FaTasks, FaClock, FaCheck, FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
import Spinner from '../../components/ui/Spinner';
import TaskTable from '../../components/tasks/TaskTable';

function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, filteredTasks, isLoading } = useSelector((state) => state.tasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  // Apply filters when tasks, searchTerm, or statusFilter changes
  useEffect(() => {
    dispatch(filterTasks({ searchTerm, status: statusFilter }));
  }, [dispatch, tasks, searchTerm, statusFilter]);

  // Calculate task stats with memoization to avoid recalculation
  const taskStats = useMemo(() => {
    const statuses = tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      { backlog: 0, 'in-progress': 0, review: 0, completed: 0 }
    );

    return {
      total: tasks.length,
      completed: statuses.completed || 0,
      inProgress: statuses['in-progress'] || 0,
      waiting: (statuses.backlog || 0) + (statuses.review || 0)
    };
  }, [tasks]);

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    if (taskStats.total === 0) return 0;
    return Math.round((taskStats.completed / taskStats.total) * 100);
  }, [taskStats]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard p-6">
      <div className="dashboard__header flex justify-between items-start animate-fade-in mb-6">
        <div>
          <h1 className="dashboard__title text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome, {user?.name}!
          </h1>
          <p className="dashboard__subtitle text-gray-600 dark:text-gray-300">
            {user?.role === 'manager' 
              ? 'Manage your team and track progress' 
              : 'Track your tasks and progress'}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="logout-btn flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transform hover:scale-[1.03] active:scale-95"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
        {/* Total Tasks Card */}
        <div className="stats-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-4 transform hover:scale-[1.02]">
          <div className="stats-card__icon bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-3 rounded-full">
            <FaTasks className="text-xl" />
          </div>
          <div className="stats-card__content ml-4">
            <h3 className="stats-card__title text-gray-600 dark:text-gray-300 text-sm font-medium">Total Tasks</h3>
            <p className="stats-card__value text-2xl font-bold dark:text-white">{taskStats.total}</p>
          </div>
          <div className="stats-card__footer mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="progress-bar h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="progress-bar__fill h-full bg-blue-500 dark:bg-blue-400 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="stats-card__percentage text-xs text-gray-500 dark:text-gray-400 mt-1 block">{completionPercentage}% completed</span>
          </div>
        </div>

        {/* In Progress Tasks Card */}
        <div className="stats-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-4 transform hover:scale-[1.02]">
          <div className="stats-card__icon bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300 p-3 rounded-full">
            <FaClock className="text-xl" />
          </div>
          <div className="stats-card__content ml-4">
            <h3 className="stats-card__title text-gray-600 dark:text-gray-300 text-sm font-medium">In Progress</h3>
            <p className="stats-card__value text-2xl font-bold dark:text-white">{taskStats.inProgress}</p>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="stats-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-4 transform hover:scale-[1.02]">
          <div className="stats-card__icon bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 p-3 rounded-full">
            <FaCheck className="text-xl" />
          </div>
          <div className="stats-card__content ml-4">
            <h3 className="stats-card__title text-gray-600 dark:text-gray-300 text-sm font-medium">Completed</h3>
            <p className="stats-card__value text-2xl font-bold dark:text-white">{taskStats.completed}</p>
          </div>
        </div>

        {/* Waiting Tasks Card */}
        <div className="stats-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all p-4 transform hover:scale-[1.02]">
          <div className="stats-card__icon bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 p-3 rounded-full">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <div className="stats-card__content ml-4">
            <h3 className="stats-card__title text-gray-600 dark:text-gray-300 text-sm font-medium">Waiting</h3>
            <p className="stats-card__value text-2xl font-bold dark:text-white">{taskStats.waiting}</p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filters flex flex-col md:flex-row gap-4 justify-between mb-6 animate-fade-in">
        <div className="search-container flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="select-input px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All statuses</option>
            <option value="backlog">Backlog</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="tasks-container bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-fade-in">
        <h2 className="section-title text-xl font-bold text-gray-800 dark:text-white mb-4">
          {statusFilter !== 'all' 
            ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks` 
            : 'All Tasks'}
        </h2>
        
        {filteredTasks.length === 0 ? (
          <div className="empty-state text-center py-12 text-gray-500 dark:text-gray-400">
            <p>No tasks found. {searchTerm ? 'Try a different search term.' : ''}</p>
          </div>
        ) : (
          <TaskTable tasks={filteredTasks} />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
