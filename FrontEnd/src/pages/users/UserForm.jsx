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
    <div className="user-form-container p-6 animate-fade-in">
      <div className="user-form-header mb-6">
        <h1 className="user-form-title flex items-center text-2xl font-bold text-gray-800 dark:text-white mb-2">
          <FaUser className="mr-2 text-blue-600 dark:text-blue-400" />
          {isEditMode ? 'Edit User' : 'Create User'}
        </h1>
        <p className="user-form-subtitle text-gray-600 dark:text-gray-300">
          {isEditMode ? 'Update user details and save changes' : 'Fill in the details to create a new user'}
        </p>
      </div>

      <div className="user-form-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="user-form space-y-6">
          <div className="form-group">
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formSubmitted && formErrors.name ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
              placeholder="Enter full name"
            />
            {formSubmitted && formErrors.name && (
              <div className="text-red-500 text-sm mt-1">{formErrors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formSubmitted && formErrors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
              placeholder="Enter email address"
            />
            {formSubmitted && formErrors.email && (
              <div className="text-red-500 text-sm mt-1">{formErrors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
              {isEditMode ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formSubmitted && formErrors.password ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
              placeholder={isEditMode ? 'Enter new password or leave blank' : 'Enter password'}
              required={!isEditMode}
            />
            {formSubmitted && formErrors.password && (
              <div className="text-red-500 text-sm mt-1">{formErrors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password2" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Confirm Password</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formSubmitted && formErrors.password2 ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
              placeholder="Confirm password"
              required={!isEditMode && formData.password.length > 0}
            />
            {formSubmitted && formErrors.password2 && (
              <div className="text-red-500 text-sm mt-1">{formErrors.password2}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
            <small className="block mt-1 text-xs text-gray-500 dark:text-gray-400">
              Managers can manage users and all tasks. Users can only manage their own tasks.
            </small>
          </div>

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
              disabled={isLoading}
            >
              <FaSave className="mr-2" />
              {isEditMode ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
