import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, filterTasks } from '../../features/tasks/taskSlice';
import { FaTasks, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../../components/ui/Spinner';
import TaskTable from '../../components/tasks/TaskTable';

function TaskList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { tasks, filteredTasks, isLoading } = useSelector((state) => state.tasks);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  const isManager = user?.role === 'manager';

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(getTasks());
  }, [dispatch]);

  // Apply filters when tasks, searchTerm, or statusFilter changes
  useEffect(() => {
    dispatch(filterTasks({ searchTerm, status: statusFilter }));
  }, [dispatch, tasks, searchTerm, statusFilter]);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // Toggle filter visibility on mobile
  const toggleFilterExpand = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <motion.div 
      className="task-list-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="task-list-header" variants={itemVariants}>
        <div className="header-left">
          <h1 className="task-list-title">
            <FaTasks className="title-icon" />
            {isManager ? 'All Tasks' : 'My Tasks'}
          </h1>
          <p className="task-list-subtitle">
            {isManager 
              ? 'View and manage all tasks across the team' 
              : 'View and manage your assigned tasks'}
          </p>
        </div>
        <div className="header-right">
          <Link to="/tasks/new" className="btn btn-primary">
            <FaPlus className="btn-icon" />
            Create Task
          </Link>
          <button 
            className="btn btn-icon btn-outline filter-toggle"
            onClick={toggleFilterExpand}
            aria-label="Toggle filters"
          >
            <FaFilter />
          </button>
        </div>
      </motion.div>

      {/* Filter and Search */}
      <motion.div 
        className={`filters-panel ${isFilterExpanded ? 'filters-panel--expanded' : ''}`}
        variants={itemVariants}
      >
        <div className="search-container">
          <FaSearch className="search-icon" />
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
            <option value="à faire">À faire</option>
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>
      </motion.div>

      {/* Tasks Table */}
      <motion.div className="tasks-wrapper" variants={itemVariants}>
        <div className="tasks-header">
          <h2 className="section-title">
            {statusFilter !== 'all' 
              ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1).replace('-', ' ')} Tasks` 
              : 'All Tasks'} 
            <span className="task-count">{filteredTasks.length}</span>
          </h2>
        </div>
        
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <motion.div 
              className="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key="empty"
            >
              <div className="empty-state__icon">
                <FaTasks />
              </div>
              <h3>No tasks found</h3>
              <p>
                {searchTerm 
                  ? 'Try a different search term or filter.' 
                  : statusFilter !== 'all' 
                    ? `No ${statusFilter} tasks found.` 
                    : 'Create a new task to get started.'}
              </p>
              <Link to="/tasks/new" className="btn btn-primary">
                <FaPlus className="btn-icon" />
                Create Task
              </Link>
            </motion.div>
          ) : (
            <motion.div 
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TaskTable tasks={filteredTasks} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default TaskList;
