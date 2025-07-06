import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useApiReady = () => {
  const { currentUser, userReady, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Só considerar pronto se:
    // 1. Não está carregando
    // 2. Há um usuário autenticado
    // 3. O usuário está pronto (token validado)
    if (!loading && currentUser && userReady) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }, [loading, currentUser, userReady]);

  return {
    isReady,
    currentUser,
    userReady,
    loading
  };
}; 