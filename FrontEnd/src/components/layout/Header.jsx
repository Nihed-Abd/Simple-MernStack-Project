import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaBars, FaSignOutAlt, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { BsMoonFill, BsSunFill } from 'react-icons/bs';
import { logout } from '../../features/auth/authSlice';
import { useTheme } from '../../hooks/useTheme';

function Header({ toggleSidebar }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle logout
  const handleLogout = () => {
    dispatch(logout());
  };

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown if clicked outside
  const closeDropdown = (e) => {
    if (!e.target.closest('.user-dropdown')) {
      setDropdownOpen(false);
    }
  };

  // Generate user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="header" onClick={closeDropdown}>
      <div className="header__container">
        <div className="header__left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <Link to="/" className="logo">
            <span className="logo__text">TeamTask</span>
          </Link>
        </div>

        <div className="header__right">
          {/* Theme Toggle */}
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <BsSunFill /> : <BsMoonFill />}
          </button>

          {/* User Profile Dropdown */}
          {user && (
            <div className="user-dropdown">
              <div className="user-dropdown__trigger" onClick={toggleDropdown}>
                <div className="avatar">
                  {getUserInitials()}
                </div>
                <span className="user-name">{user.name}</span>
                <FaChevronDown className="dropdown-icon" />
              </div>
              
              {dropdownOpen && (
                <div className="user-dropdown__menu">
                  <div className="user-dropdown__header">
                    <div className="avatar avatar--large">
                      {getUserInitials()}
                    </div>
                    <div className="user-info">
                      <span className="user-info__name">{user.name}</span>
                      <span className="user-info__email">{user.email}</span>
                      <span className="user-info__role">Role: {user.role === 'manager' ? 'Manager' : 'User'}</span>
                    </div>
                  </div>
                  
                  <div className="user-dropdown__content">
                    <Link to="/profile" className="dropdown-item">
                      <FaUserCircle className="dropdown-item__icon" />
                      <span>My Profile</span>
                    </Link>
                    
                    <button 
                      className="dropdown-item dropdown-item--danger"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="dropdown-item__icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
