import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from '../ui/Spinner';

// Component for routes that require manager role
const ManagerRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // Show spinner while checking auth status
  if (isLoading) {
    return <Spinner />;
  }

  // Check if user is authenticated and has manager role
  // Redirect to dashboard if not a manager
  return user && user.role === 'manager' ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/" />
  ) : (
    <Navigate to="/login" />
  );
};

export default ManagerRoute;
