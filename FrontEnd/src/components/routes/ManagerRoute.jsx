import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ManagerRoute = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="route-loader">
        <div className="spinner spinner-lg"></div>
      </div>
    );
  }

  // Check if user is authenticated and has manager role
  // If not, redirect to dashboard
  return isAuthenticated && user?.role === 'manager' ? 
    <Outlet /> : 
    <Navigate to="/" />;
};

export default ManagerRoute;
