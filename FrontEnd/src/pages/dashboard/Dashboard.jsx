import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, filterTasks } from '../../features/tasks/taskSlice';
import { FaTasks, FaClock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard__header"
      >
        <h1 className="dashboard__title">
          Welcome, {user?.name}!
        </h1>
        <p className="dashboard__subtitle">
          {user?.role === 'manager' 
            ? 'Manage your team and track progress' 
            : 'Track your tasks and progress'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="stats-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Total Tasks Card */}
        <motion.div 
          className="stats-card"
          whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <div className="stats-card__icon stats-card__icon--blue">
            <FaTasks />
          </div>
          <div className="stats-card__content">
            <h3 className="stats-card__title">Total Tasks</h3>
            <p className="stats-card__value">{taskStats.total}</p>
          </div>
          <div className="stats-card__footer">
            <div className="progress-bar">
              <div 
                className="progress-bar__fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="stats-card__percentage">{completionPercentage}% completed</span>
          </div>
        </motion.div>

        {/* In Progress Tasks Card */}
        <motion.div 
          className="stats-card"
          whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <div className="stats-card__icon stats-card__icon--orange">
            <FaClock />
          </div>
          <div className="stats-card__content">
            <h3 className="stats-card__title">In Progress</h3>
            <p className="stats-card__value">{taskStats.inProgress}</p>
          </div>
        </motion.div>

        {/* Completed Tasks Card */}
        <motion.div 
          className="stats-card"
          whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <div className="stats-card__icon stats-card__icon--green">
            <FaCheck />
          </div>
          <div className="stats-card__content">
            <h3 className="stats-card__title">Completed</h3>
            <p className="stats-card__value">{taskStats.completed}</p>
          </div>
        </motion.div>

        {/* Waiting Tasks Card */}
        <motion.div 
          className="stats-card"
          whileHover={{ y: -5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
        >
          <div className="stats-card__icon stats-card__icon--red">
            <FaExclamationTriangle />
          </div>
          <div className="stats-card__content">
            <h3 className="stats-card__title">Waiting</h3>
            <p className="stats-card__value">{taskStats.waiting}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Filter and Search */}
      <motion.div 
        className="filters"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="status-filter">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="select-input"
          >
            <option value="all">All statuses</option>
            <option value="backlog">Backlog</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </motion.div>

      {/* Tasks Table */}
      <motion.div 
        className="tasks-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="section-title">
          {statusFilter !== 'all' 
            ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Tasks` 
            : 'All Tasks'}
        </h2>
        
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. {searchTerm ? 'Try a different search term.' : ''}</p>
          </div>
        ) : (
          <TaskTable tasks={filteredTasks} />
        )}
      </motion.div>
    </div>
  );
}

export default Dashboard;
