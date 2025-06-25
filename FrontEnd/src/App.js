import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import TaskBoard from './pages/dashboard/TaskBoard';
import UserManagement from './pages/dashboard/UserManagement';
import NotFound from './pages/NotFound';

// Components
import PrivateRoute from './components/routing/PrivateRoute';
import ManagerRoute from './components/routing/ManagerRoute';
import Layout from './components/layout/Layout';

// Redux
import { checkUserSession } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();

  // Check if user is logged in
  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<TaskBoard />} />
          
          {/* Manager Only Routes */}
          <Route path="users" element={<ManagerRoute><UserManagement /></ManagerRoute>} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
