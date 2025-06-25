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
    status: 'à faire',
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
    <div className="task-form-container p-6 animate-fade-in">
      <div className="task-form-header mb-6">
        <h1 className="task-form-title flex items-center text-2xl font-bold text-gray-800 dark:text-white mb-2">
          <FaTasks className="mr-2 text-blue-600 dark:text-blue-400" />
          {isEditMode ? 'Edit Task' : 'Create Task'}
        </h1>
        <p className="task-form-subtitle text-gray-600 dark:text-gray-300">
          {isEditMode 
            ? 'Update task details and save changes' 
            : 'Fill in the details to create a new task'}
        </p>
      </div>

      <div className="task-form-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="task-form space-y-6">
          <div className="form-group">
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formSubmitted && !formData.title.trim() ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
              placeholder="Enter task title"
            />
            {formSubmitted && !formData.title.trim() && (
              <div className="text-red-500 text-sm mt-1">Title is required</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter task description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="à faire">À faire</option>
              <option value="en cours">En cours</option>
              <option value="terminée">Terminée</option>
            </select>
          </div>

          {user?.role === 'manager' && (
            <div className="form-group">
              <label htmlFor="assignedTo" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Assigned To</label>
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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

          <div className="form-actions flex justify-end gap-4 mt-8">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-4 py-2 flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-transform active:scale-95 transform hover:scale-[1.02]"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 flex items-center justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform active:scale-95 transform hover:scale-[1.02]"
              disabled={taskLoading}
            >
              <FaSave className="mr-2" />
              {isEditMode ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
