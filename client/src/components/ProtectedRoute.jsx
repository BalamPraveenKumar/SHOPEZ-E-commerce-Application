import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './Loading';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return <Loading />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.userType !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
