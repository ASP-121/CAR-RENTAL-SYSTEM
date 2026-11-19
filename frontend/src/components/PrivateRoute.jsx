import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getCurrentUser, getToken } from '../services/api';

export default function PrivateRoute({ children, requiredRole }) {
  const location = useLocation();
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(getToken());
      setUser(getCurrentUser());
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  // If not authenticated, force redirect to /auth
  if (!token || !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If a role is required (e.g., ADMIN) and user does not have it
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/fleet" replace />;
  }

  return children;
}
