import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTaskById, deleteTask } from '../../features/tasks/taskSlice';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
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
      'backlog': 'status-badge--gray',
      'in-progress': 'status-badge--blue',
      'review': 'status-badge--orange',
      'completed': 'status-badge--green',
    };

    const statusLabels = {
      'backlog': 'Backlog',
      'in-progress': 'In Progress',
      'review': 'Review',
      'completed': 'Completed',
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  if (isLoading || !currentTask) {
    return <Spinner />;
  }

  return (
    <motion.div 
      className="task-detail-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back button */}
      <div className="back-navigation">
        <Link to="/tasks" className="back-button">
          <FaArrowLeft /> Back to Tasks
        </Link>
      </div>

      <div className="task-detail-header">
        <div className="task-detail-title-section">
          <h1 className="task-detail-title">{currentTask.title}</h1>
          <StatusBadge status={currentTask.status} />
        </div>
        
        {canModifyTask && (
          <div className="task-detail-actions">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={() => navigate(`/tasks/${id}/edit`)}
            >
              <FaEdit className="btn-icon" /> Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-danger"
              onClick={handleDelete}
            >
              <FaTrash className="btn-icon" /> Delete
            </motion.button>
          </div>
        )}
      </div>

      <motion.div
        className="task-detail-card"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Task Information */}
        <div className="task-info-section">
          <h2 className="section-title">Description</h2>
          <p className="task-description">
            {currentTask.description || 'No description provided.'}
          </p>

          <div className="task-meta-grid">
            <div className="task-meta-item">
              <h3 className="task-meta-title">Status</h3>
              <StatusBadge status={currentTask.status} />
            </div>

            <div className="task-meta-item">
              <h3 className="task-meta-title">Assigned To</h3>
              <p>{currentTask.assignedTo?.name || 'Unassigned'}</p>
            </div>

            <div className="task-meta-item">
              <h3 className="task-meta-title">Created By</h3>
              <p>{currentTask.createdBy?.name || 'Unknown'}</p>
            </div>

            <div className="task-meta-item">
              <h3 className="task-meta-title">Created At</h3>
              <p>{formatDate(currentTask.createdAt)}</p>
            </div>

            <div className="task-meta-item">
              <h3 className="task-meta-title">Last Updated</h3>
              <p>{formatDate(currentTask.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Task Timeline */}
        <div className="task-timeline">
          <h2 className="section-title">Task Timeline</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <FaCheck className="timeline-icon" />
              </div>
              <div className="timeline-content">
                <h4 className="timeline-title">Task Created</h4>
                <p className="timeline-date">{formatDate(currentTask.createdAt)}</p>
              </div>
            </div>

            {currentTask.updatedAt !== currentTask.createdAt && (
              <div className="timeline-item">
                <div className="timeline-marker">
                  <FaClock className="timeline-icon" />
                </div>
                <div className="timeline-content">
                  <h4 className="timeline-title">Last Updated</h4>
                  <p className="timeline-date">{formatDate(currentTask.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default TaskDetail;
