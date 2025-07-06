import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, userReady, loading } = useAuth();

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Se não há usuário autenticado, redirecionar para login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário está autenticado mas ainda não está pronto (token não validado)
  if (!userReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil do usuário...</p>
        </div>
      </div>
    );
  }

  // Se tudo está pronto, renderizar o conteúdo protegido
  return children;
};

export default ProtectedRoute;

