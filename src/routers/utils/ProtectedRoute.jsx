import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Pastikan path ini benar

const ProtectedRoute = () => {
  const { auth } = useAuth();
  
  return auth.isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
