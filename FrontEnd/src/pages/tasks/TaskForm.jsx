import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createTask, 
  updateTask, 
  getTaskById,
  reset
} from '../../features/tasks/taskSlice';
import { getUsers } from '../../features/users/userSlice';
import { FaTasks, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Spinner from '../../components/ui/Spinner';

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const { user } = useSelector((state) => state.auth);
  const { currentTask, isLoading: taskLoading } = useSelector((state) => state.tasks);
  const { users, isLoading: usersLoading } = useSelector((state) => state.users);

  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'backlog',
    assignedTo: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch task if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(getTaskById(id));
    }

    // Fetch users list for assignment dropdown (if manager)
    if (user?.role === 'manager') {
      dispatch(getUsers());
    }

    // Cleanup
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, isEditMode, user?.role]);

  // Populate form when task is loaded in edit mode
  useEffect(() => {
    if (isEditMode && currentTask) {
      setFormData({
        title: currentTask.title || '',
        description: currentTask.description || '',
        status: currentTask.status || 'backlog',
        assignedTo: currentTask.assignedTo?._id || '',
      });
    }
  }, [isEditMode, currentTask]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (formData.title.trim() === '') {
      return; // Don't submit if title is empty
    }

    if (isEditMode) {
      dispatch(updateTask({
        taskId: id,
        taskData: formData,
      })).then((result) => {
        if (!result.error) {
          navigate('/tasks');
        }
      });
    } else {
      dispatch(createTask(formData)).then((result) => {
        if (!result.error) {
          navigate('/tasks');
        }
      });
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    navigate(-1);
  };

  if (taskLoading || usersLoading) {
    return <Spinner />;
  }

  return (
    <motion.div 
      className="task-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="task-form-header">
        <h1 className="task-form-title">
          <FaTasks className="task-form-icon" />
          {isEditMode ? 'Edit Task' : 'Create Task'}
        </h1>
        <p className="task-form-subtitle">
          {isEditMode 
            ? 'Update task details and save changes' 
            : 'Fill in the details to create a new task'}
        </p>
      </div>

      <div className="task-form-card">
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`form-control ${formSubmitted && !formData.title.trim() ? 'is-invalid' : ''}`}
              placeholder="Enter task title"
            />
            {formSubmitted && !formData.title.trim() && (
              <div className="invalid-feedback">Title is required</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter task description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="backlog">Backlog</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {user?.role === 'manager' && (
            <div className="form-group">
              <label htmlFor="assignedTo" className="form-label">Assigned To</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="form-control"
              >
                <option value="">-- Unassigned --</option>
                {users?.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-actions">
            <motion.button 
              type="button" 
              onClick={handleCancel}
              className="btn btn-outline"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaTimes className="btn-icon" />
              Cancel
            </motion.button>
            <motion.button 
              type="submit" 
              className="btn btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={taskLoading}
            >
              <FaSave className="btn-icon" />
              {isEditMode ? 'Update Task' : 'Create Task'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default TaskForm;
