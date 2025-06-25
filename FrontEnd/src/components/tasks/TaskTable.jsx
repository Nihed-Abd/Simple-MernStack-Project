import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import PropTypes from 'prop-types';

function TaskTable({ tasks }) {
  const { user } = useSelector((state) => state.auth);
  const isManager = user?.role === 'manager';

  // Status badge component with color coding
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      'à faire': 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      'en cours': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'terminée': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    };

    const statusLabels = {
      'à faire': 'À faire',
      'en cours': 'En cours',
      'terminée': 'Terminée',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || ''}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  return (
    <div className="task-table-container w-full overflow-hidden">
      <div className="task-table-responsive overflow-x-auto">
        <table className="task-table w-full border-collapse text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created By</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tasks.map((task) => (
                <tr
                  key={task._id}
                  className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ease-in-out animate-fade-in"
                >
                  <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 font-medium">{task.title}</td>
                  <td className="px-4 py-3 text-sm">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.assignedTo?.name || 'Unassigned'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{task.createdBy?.name || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="action-buttons flex gap-2">
                      <Link to={`/tasks/${task._id}`} className="p-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                        <FaEye size={14} />
                      </Link>
                      
                      {/* Edit button - shown if user is task creator or manager */}
                      {(isManager || task.createdBy?._id === user?._id) && (
                        <Link to={`/tasks/${task._id}/edit`} className="p-1.5 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                          <FaEdit size={14} />
                        </Link>
                      )}
                      
                      {/* Delete button - shown if user is task creator or manager */}
                      {(isManager || task.createdBy?._id === user?._id) && (
                        <Link to={`/tasks/${task._id}/delete`} className="p-1.5 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                          <FaTrash size={14} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="empty-table bg-white dark:bg-gray-800 p-8 text-center text-gray-500 dark:text-gray-400 rounded-lg shadow mt-4">
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
