import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';

// Layout
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Protected Routes
import PrivateRoute from './components/routing/PrivateRoute';
import ManagerRoute from './components/routing/ManagerRoute';

// Dashboard and Tasks
import Dashboard from './pages/dashboard/Dashboard';
import TaskBoard from './pages/dashboard/TaskBoard';
import TaskList from './pages/tasks/TaskList';
import TaskForm from './pages/tasks/TaskForm';
import TestTaskForm from './pages/tasks/TestTaskForm';
import TaskDetail from './pages/tasks/TaskDetail';

// Users (Manager only)
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';
import UserManagement from './pages/dashboard/UserManagement';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Test Route - Direct access */}
          <Route path="/test" element={<TestTaskForm />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/task-board" element={<TaskBoard />} />
              <Route path="/tasks" element={<TaskList />} />
              <Route path="/tasks/new" element={<TaskForm />} />
              <Route path="/tasks/:id" element={<TaskDetail />} />
              <Route path="/tasks/:id/edit" element={<TaskForm />} />
              
              {/* Manager Only Routes */}
              <Route element={<ManagerRoute />}>
                <Route path="/users" element={<UsersList />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/:id/edit" element={<UserForm />} />
                <Route path="/tasks/all" element={<TaskList />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </Router>

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
}

export default App;
