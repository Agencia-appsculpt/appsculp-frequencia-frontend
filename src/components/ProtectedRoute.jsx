import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userProfile, userReady, loading } = useAuth();

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

  // Verificar se há restrição de roles
  if (allowedRoles && userProfile) {
    const userRole = userProfile.role;
    if (!allowedRoles.includes(userRole)) {
      console.log(`Acesso negado: usuário tem role ${userRole}, mas apenas ${allowedRoles.join(', ')} são permitidos`);
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Se tudo está pronto, renderizar o conteúdo protegido
  return children;
};

export default ProtectedRoute;

