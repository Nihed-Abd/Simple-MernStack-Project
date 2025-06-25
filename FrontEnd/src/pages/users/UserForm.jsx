import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createUser,
  updateUser,
  getUserById,
  reset
} from '../../features/users/userSlice';
import { FaUser, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Spinner from '../../components/ui/Spinner';

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get state from Redux
  const { currentUser, isLoading } = useSelector((state) => state.users);

  const isEditMode = Boolean(id);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'user',
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Fetch user if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(getUserById(id));
    }

    // Cleanup
    return () => {
      dispatch(reset());
    };
  }, [dispatch, id, isEditMode]);

  // Populate form when user is loaded in edit mode
  useEffect(() => {
    if (isEditMode && currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        password2: '',
        role: currentUser.role || 'user',
      });
    }
  }, [isEditMode, currentUser]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    
    // Clear error for this field when it's edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate password (only if creating a new user or if password field is filled)
    if (!isEditMode || formData.password) {
      if (!isEditMode && !formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      // Confirm passwords match
      if (formData.password !== formData.password2) {
        errors.password2 = 'Passwords do not match';
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Prepare data - remove confirm password field
    const userData = { ...formData };
    delete userData.password2;
    
    // Remove empty password in edit mode
    if (isEditMode && !userData.password) {
      delete userData.password;
    }

    if (isEditMode) {
      dispatch(updateUser({
        userId: id,
        userData,
      })).then((result) => {
        if (!result.error) {
          navigate('/users');
        }
      });
    } else {
      dispatch(createUser(userData)).then((result) => {
        if (!result.error) {
          navigate('/users');
        }
      });
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    navigate(-1);
  };

  if (isLoading && isEditMode) {
    return <Spinner />;
  }

  return (
    <motion.div 
      className="user-form-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="user-form-header">
        <h1 className="user-form-title">
          <FaUser className="user-form-icon" />
          {isEditMode ? 'Edit User' : 'Create User'}
        </h1>
        <p className="user-form-subtitle">
          {isEditMode 
            ? 'Update user details and save changes' 
            : 'Fill in the details to create a new user'}
        </p>
      </div>

      <div className="user-form-card">
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${formSubmitted && formErrors.name ? 'is-invalid' : ''}`}
              placeholder="Enter full name"
            />
            {formSubmitted && formErrors.name && (
              <div className="invalid-feedback">{formErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${formSubmitted && formErrors.email ? 'is-invalid' : ''}`}
              placeholder="Enter email address"
            />
            {formSubmitted && formErrors.email && (
              <div className="invalid-feedback">{formErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              {isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${formSubmitted && formErrors.password ? 'is-invalid' : ''}`}
              placeholder={isEditMode ? 'Enter new password or leave blank' : 'Enter password'}
              required={!isEditMode}
            />
            {formSubmitted && formErrors.password && (
              <div className="invalid-feedback">{formErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={`form-control ${formSubmitted && formErrors.password2 ? 'is-invalid' : ''}`}
              placeholder="Confirm password"
              required={!isEditMode && formData.password.length > 0}
            />
            {formSubmitted && formErrors.password2 && (
              <div className="invalid-feedback">{formErrors.password2}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-control"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <small className="form-text text-muted">
              Managers can manage users and all tasks. Users can only manage their own tasks.
            </small>
          </div>

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
              disabled={isLoading}
            >
              <FaSave className="btn-icon" />
              {isEditMode ? 'Update User' : 'Create User'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default UserForm;
