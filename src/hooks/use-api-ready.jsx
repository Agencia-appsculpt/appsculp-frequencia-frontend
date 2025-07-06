import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const useApiReady = () => {
  const { currentUser, userReady, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('useApiReady - Estado atual:', {
      loading,
      currentUser: !!currentUser,
      userReady,
      isReady
    });

    // Só considerar pronto se:
    // 1. Não está carregando
    // 2. Há um usuário autenticado
    // 3. O usuário está pronto (token validado)
    if (!loading && currentUser && userReady) {
      console.log('useApiReady - Usuário pronto para requisições!');
      setIsReady(true);
    } else {
      console.log('useApiReady - Usuário ainda não pronto');
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