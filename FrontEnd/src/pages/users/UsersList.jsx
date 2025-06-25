import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../../features/users/userSlice';
import { FaUsers, FaUserPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Spinner from '../../components/ui/Spinner';

function UsersList() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) || 
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <motion.div 
      className="users-list-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="users-list-header">
        <div className="header-left">
          <h1 className="users-list-title">
            <FaUsers className="title-icon" />
            User Management
          </h1>
          <p className="users-list-subtitle">
            Manage team members and their roles
          </p>
        </div>
        <div className="header-right">
          <Link to="/users/new" className="btn btn-primary">
            <FaUserPlus className="btn-icon" />
            Add New User
          </Link>
        </div>
      </div>

      {/* Search */}
      <motion.div 
        className="search-container"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div 
        className="users-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredUsers.map((user) => (
                  <motion.tr 
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(var(--highlight-rgb), 0.05)' }}
                  >
                    <td className="user-name">
                      <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                      <span>{user.name}</span>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge role-badge--${user.role}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/users/${user._id}/edit`} className="btn btn-icon btn-primary">
                          <FaEdit />
                        </Link>
                        <Link to={`/users/${user._id}/delete`} className="btn btn-icon btn-danger">
                          <FaTrash />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <p>No users found. {searchTerm ? 'Try a different search term.' : ''}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default UsersList;
