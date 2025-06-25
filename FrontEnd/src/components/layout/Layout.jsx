import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1200);
  const { user } = useSelector((state) => state.auth);

  // Handle sidebar visibility based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar (for mobile)
  const closeSidebar = () => {
    if (window.innerWidth < 1200) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="layout">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="layout__container">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        
        <main className={`layout__content ${sidebarOpen ? 'layout__content--with-sidebar' : ''}`}>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Layout;
