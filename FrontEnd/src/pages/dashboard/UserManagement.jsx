import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch, FiFilter, FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { getUsers, deleteUser } from '../../features/users/userSlice';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Handle user deletion
  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      dispatch(deleteUser(selectedUser._id));
      setShowConfirmDelete(false);
      setSelectedUser(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setSelectedUser(null);
  };

  return (
    <div className="users-list-container">
      <div className="users-list-header">
        <div className="header-left">
          <h1 className="users-list-title">
            <FiUsers className="title-icon" /> User Management
          </h1>
          <p className="users-list-subtitle">Manage system users and their permissions</p>
        </div>
        <div className="header-right">
          <Link to="/users/new" className="btn btn-primary">
            <FiPlus /> Add User
          </Link>
        </div>
      </div>

      <div className="filters-panel">
        <div className="filters-form">
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-options">
            <div className="filter-group">
              <label className="filter-label">
                <FiFilter /> Role:
              </label>
              <select
                className="filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
        </div>
      ) : (
        <div className="users-wrapper">
          <div className="users-header">
            <h2 className="section-title">
              Users List 
              <span className="user-count">{filteredUsers.length}</span>
            </h2>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="table-responsive">
              <table className="table users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Tasks</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr 
                      key={user._id}
                      className="animate-fade-in transition-opacity duration-300"
                    >
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {user.name.charAt(0)}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge badge-role-${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="user-tasks">
                        <span className="task-count">
                          {user.taskCount || 0}
                        </span>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-right">
                        <div className="table-actions">
                          <Link 
                            to={`/users/${user._id}/edit`} 
                            className="btn btn-icon btn-sm btn-outline"
                            title="Edit user"
                          >
                            <FiEdit2 />
                          </Link>
                          <button
                            className="btn btn-icon btn-sm btn-danger"
                            title="Delete user"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <FiUsers />
              </div>
              <h3 className="empty-state-title">No users found</h3>
              <p className="empty-state-description">
                {searchTerm || roleFilter !== 'all'
                  ? "Try adjusting your filters to find what you're looking for."
                  : "You haven't added any users yet."}
              </p>
              {!searchTerm && roleFilter === 'all' && (
                <Link to="/users/new" className="btn btn-primary">
                  <FiPlus /> Add User
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmDelete && (
        <div className="confirm-delete-modal show fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full mx-4 animate-fade-in-down transform transition-all duration-300"
          >
            <div className="modal-header">
              <h3 className="modal-title">
                <FiTrash2 className="modal-icon" /> Confirm Deletion
              </h3>
              <button className="close-button" onClick={cancelDelete}>×</button>
            </div>
            <div className="modal-body">
              <p className="confirmation-text">
                Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? 
                This action cannot be undone.
              </p>
              <p>All tasks assigned to this user will be unassigned.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
