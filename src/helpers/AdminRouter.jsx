import React from 'react';
import { Navigate } from 'react-router-dom';

// AdminRoute: Only allow access if isAdmin is true, else redirect to home
export const AdminRoute = ({ isAdmin, children }) => {
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// NonAdminRoute: Only allow access if isAdmin is false, else redirect to admin panel
export const NonAdminRoute = ({ isAdmin, children }) => {
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};
