import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // If role is required and user doesn't have it, redirect to appropriate page
  if (requiredRole && userRole !== requiredRole.toString()) {
    // Redirect admin to admin page, normal users to catalog
    return userRole === "2" ? 
      <Navigate to="/sse-test" replace /> : 
      <Navigate to="/catalogo" replace />;
  }
  
  // If authenticated and has required role (or no specific role required), render the component
  return element;
};

export default ProtectedRoute;