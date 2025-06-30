import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ProtectedRoute: React.FC = () => {
  const { userToken } = useSelector((state: RootState) => state.auth);

  // If not authenticated, redirect to hero page
  if (!userToken) {
    return <Navigate to="/hero" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;