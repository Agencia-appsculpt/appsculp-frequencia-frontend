import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, userProfile } = useAuth();

  // Se não estiver autenticado, redirecionar para login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se roles específicos são necessários, verificar se o usuário tem permissão
  if (requiredRoles.length > 0 && userProfile) {
    if (!requiredRoles.includes(userProfile.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

