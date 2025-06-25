import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  FaTimes, 
  FaHome, 
  FaTasks, 
  FaPlus, 
  FaUsers, 
  FaClipboardList,
  FaUserPlus
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function Sidebar({ isOpen, closeSidebar }) {
  const { user } = useSelector((state) => state.auth);

  // Animation variants for sidebar
  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const isManager = user?.role === 'manager';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile overlay */}
          <motion.div 
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
          
          {/* Sidebar */}
          <motion.aside 
            className="sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="sidebar__header">
              <div className="sidebar__logo">
                <span className="logo-icon">TT</span>
                <span className="logo-text">TeamTask</span>
              </div>
              <button className="close-button" onClick={closeSidebar}>
                <FaTimes />
              </button>
            </div>

            <nav className="sidebar__nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <NavLink to="/" className="nav-link" onClick={closeSidebar}>
                    <FaHome className="nav-icon" />
                    <span className="nav-text">Dashboard</span>
                  </NavLink>
                </li>
                
                <li className="nav-item">
                  <NavLink to="/task-board" className="nav-link" onClick={closeSidebar}>
                    <FaClipboardList className="nav-icon" />
                    <span className="nav-text">Task Board</span>
                  </NavLink>
                </li>
                
                <li className="nav-item">
                  <NavLink to="/tasks" className="nav-link" onClick={closeSidebar}>
                    <FaTasks className="nav-icon" />
                    <span className="nav-text">My Tasks</span>
                  </NavLink>
                </li>
                
                <li className="nav-item">
                  <NavLink to="/tasks/new" className="nav-link" onClick={closeSidebar}>
                    <FaPlus className="nav-icon" />
                    <span className="nav-text">Create Task</span>
                  </NavLink>
                </li>
                
                {isManager && (
                  <>
                    <li className="nav-divider"></li>
                    <li className="nav-heading">Manager</li>
                    
                    <li className="nav-item">
                      <NavLink to="/users" className="nav-link" onClick={closeSidebar}>
                        <FaUsers className="nav-icon" />
                        <span className="nav-text">Users List</span>
                      </NavLink>
                    </li>
                    
                    <li className="nav-item">
                      <NavLink to="/user-management" className="nav-link" onClick={closeSidebar}>
                        <FaUsers className="nav-icon" />
                        <span className="nav-text">User Management</span>
                      </NavLink>
                    </li>
                    
                    <li className="nav-item">
                      <NavLink to="/users/new" className="nav-link" onClick={closeSidebar}>
                        <FaUserPlus className="nav-icon" />
                        <span className="nav-text">Add User</span>
                      </NavLink>
                    </li>
                    
                    <li className="nav-item">
                      <NavLink to="/tasks/all" className="nav-link" onClick={closeSidebar}>
                        <FaClipboardList className="nav-icon" />
                        <span className="nav-text">All Tasks</span>
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
              
              <div className="sidebar__footer">
                <p className="version">TeamTask v1.0.0</p>
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default Sidebar;
