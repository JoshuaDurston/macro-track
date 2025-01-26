import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = () => {
  const { user } = useAuth(); // Using user from context to check if logged in

  if (!user) {
    // If user is not logged in, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If the user is logged in, render the children components (protected routes)
  return <Outlet />;
};

export default PrivateRoute;
