import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { checkUserSession } from '../../features/auth/authSlice';
import Spinner from '../ui/Spinner';

// Component for routes that require authentication
const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if session is valid when component mounts
    const validateSession = async () => {
      await dispatch(checkUserSession());
      setIsChecking(false);
    };

    validateSession();
  }, [dispatch]);

  // Show spinner while checking the session
  if (isLoading || isChecking) {
    return <Spinner />;
  }

  // If user is not authenticated, redirect to login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
