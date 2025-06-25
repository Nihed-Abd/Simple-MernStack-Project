import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

function TaskTable({ tasks }) {
  const { user } = useSelector((state) => state.auth);
  const isManager = user?.role === 'manager';

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

  return (
    <div className="task-table-container">
      <div className="task-table-responsive">
        <table className="task-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.tr
                  key={task._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ backgroundColor: 'rgba(var(--highlight-rgb), 0.05)' }}
                >
                  <td className="task-title">{task.title}</td>
                  <td>
                    <StatusBadge status={task.status} />
                  </td>
                  <td>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td>{task.createdBy?.name || 'Unknown'}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/tasks/${task._id}`} className="btn btn-icon btn-info">
                        <FaEye />
                      </Link>
                      
                      {/* Edit button - shown if user is task creator or manager */}
                      {(isManager || task.createdBy?._id === user?._id) && (
                        <Link to={`/tasks/${task._id}/edit`} className="btn btn-icon btn-primary">
                          <FaEdit />
                        </Link>
                      )}
                      
                      {/* Delete button - shown if user is task creator or manager */}
                      {(isManager || task.createdBy?._id === user?._id) && (
                        <Link to={`/tasks/${task._id}/delete`} className="btn btn-icon btn-danger">
                          <FaTrash />
                        </Link>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="empty-table">
          <p>No tasks found.</p>
        </div>
      )}
    </div>
  );
}

TaskTable.propTypes = {
  tasks: PropTypes.array.isRequired
};

export default TaskTable;
