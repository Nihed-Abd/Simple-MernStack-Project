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

function Sidebar({ isOpen, closeSidebar }) {
  const { user } = useSelector((state) => state.auth);
  const isManager = user?.role === 'manager';

  return (
      <>
        {isOpen && (
          <>
            {/* Mobile overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out"
              onClick={closeSidebar}
            />
            
            {/* Sidebar */}
            <aside 
              className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white dark:bg-blue-500 rounded-md text-sm font-bold">TT</span>
                <span className="text-gray-800 dark:text-white text-lg font-semibold">TeamTask</span>
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white rounded-md transition-colors" onClick={closeSidebar}>
                <FaTimes size={18} />
              </button>
            </div>

            <nav className="py-4">
              <ul className="space-y-1 px-3">
                <li>
                  <NavLink to="/" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                    <FaHome className="mr-3 text-lg" />
                    <span>Dashboard</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink to="/task-board" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                    <FaClipboardList className="mr-3 text-lg" />
                    <span>Task Board</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink to="/tasks" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                    <FaTasks className="mr-3 text-lg" />
                    <span>My Tasks</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink to="/tasks/new" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                    <FaPlus className="mr-3 text-lg" />
                    <span>Create Task</span>
                  </NavLink>
                </li>
                
                {isManager && (
                  <>
                    <li className="border-t border-gray-200 dark:border-gray-700 my-3"></li>
                    <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manager</li>
                    
                    <li>
                      <NavLink to="/users" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                        <FaUsers className="mr-3 text-lg" />
                        <span>Users List</span>
                      </NavLink>
                    </li>
                    
                    <li>
                      <NavLink to="/user-management" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                        <FaUsers className="mr-3 text-lg" />
                        <span>User Management</span>
                      </NavLink>
                    </li>
                    
                    <li>
                      <NavLink to="/users/new" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                        <FaUserPlus className="mr-3 text-lg" />
                        <span>Add User</span>
                      </NavLink>
                    </li>
                    
                    <li>
                      <NavLink to="/tasks/all" className={({isActive}) => `flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 rounded-md transition-colors ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={closeSidebar}>
                        <FaClipboardList className="mr-3 text-lg" />
                        <span>All Tasks</span>
                      </NavLink>
                    </li>
                  </>
                )}
              </ul>
              
              <div className="absolute bottom-0 left-0 w-full px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-xs">
                <p>TeamTask v1.0.0</p>
              </div>
            </nav>
            </aside>
          </>
        )}
      </>
  );
}

export default Sidebar;
