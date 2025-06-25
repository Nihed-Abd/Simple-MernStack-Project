import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskById, deleteTask } from '../../features/tasks/taskSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentTask, isLoading } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);

  // Check if user can edit/delete this task
  const canModifyTask = user?.role === 'manager' || 
    (currentTask?.createdBy?._id === user?._id);

  // Fetch task data
  useEffect(() => {
    dispatch(getTaskById(id));
  }, [dispatch, id]);

  // Handle task deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      dispatch(deleteTask(id)).then((result) => {
        if (!result.error) {
          navigate('/tasks');
        }
      });
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge component with color coding
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'à faire': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'en cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'terminée': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    };

    const statusLabels = {
      'à faire': 'À faire',
      'en cours': 'En cours',
      'terminée': 'Terminée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  if (isLoading || !currentTask) {
    return <Spinner />;
  }

  return (
    <div className="task-detail-container p-6 animate-fade-in">
      {/* Back button */}
      <div className="back-navigation mb-6">
        <Link to="/tasks" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          <FaArrowLeft className="mr-2" /> Back to Tasks
        </Link>
      </div>

      <div className="task-detail-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="task-detail-title-section mb-4 md:mb-0">
          <h1 className="task-detail-title text-2xl font-bold text-gray-800 dark:text-white mb-2">{currentTask.title}</h1>
          <StatusBadge status={currentTask.status} />
        </div>
        
        {canModifyTask && (
          <div className="task-detail-actions flex space-x-3">
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => navigate(`/tasks/${id}/edit`)}
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleDelete}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        )}
      </div>

      <div
        className="task-detail-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transform translate-y-0 opacity-100 transition-all duration-500 ease-out animate-fade-in-up"
      >
        {/* Task Information */}
        <div className="task-info-section mb-8">
          <h2 className="section-title text-xl font-semibold text-gray-800 dark:text-white mb-3">Description</h2>
          <p className="task-description text-gray-700 dark:text-gray-300 mb-6">
            {currentTask.description || 'No description provided.'}
          </p>

          <div className="task-meta-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="task-meta-item bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="task-meta-title text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h3>
              <StatusBadge status={currentTask.status} />
            </div>

            <div className="task-meta-item bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="task-meta-title text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Assigned To</h3>
              <p className="text-gray-800 dark:text-white">{currentTask.assignedTo?.name || 'Unassigned'}</p>
            </div>

            <div className="task-meta-item bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="task-meta-title text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created By</h3>
              <p className="text-gray-800 dark:text-white">{currentTask.createdBy?.name || 'Unknown'}</p>
            </div>

            <div className="task-meta-item bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="task-meta-title text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</h3>
              <p className="text-gray-800 dark:text-white">{formatDate(currentTask.createdAt)}</p>
            </div>

            <div className="task-meta-item bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="task-meta-title text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last Updated</h3>
              <p className="text-gray-800 dark:text-white">{formatDate(currentTask.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Task Timeline */}
        <div className="task-timeline mt-8">
          <h2 className="section-title text-xl font-semibold text-gray-800 dark:text-white mb-4">Task Timeline</h2>
          <div className="timeline space-y-4">
            <div className="timeline-item flex items-start">
              <div className="timeline-marker flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                <FaCheck className="text-green-600 dark:text-green-400" />
              </div>
              <div className="timeline-content">
                <h4 className="timeline-title font-medium text-gray-800 dark:text-white">Task Created</h4>
                <p className="timeline-date text-sm text-gray-500 dark:text-gray-400">{formatDate(currentTask.createdAt)}</p>
              </div>
            </div>

            {currentTask.updatedAt !== currentTask.createdAt && (
              <div className="timeline-item flex items-start">
                <div className="timeline-marker flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-4">
                  <FaClock className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="timeline-content">
                  <h4 className="timeline-title font-medium text-gray-800 dark:text-white">Last Updated</h4>
                  <p className="timeline-date text-sm text-gray-500 dark:text-gray-400">{formatDate(currentTask.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
