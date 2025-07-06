import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase.jsx';
import api from '../config/api.jsx';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userReady, setUserReady] = useState(false);

  // Função para fazer login
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Função para registrar usuário
  const register = async (email, password, name, role = 'aluno') => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil do usuário no Firebase
      await updateProfile(result.user, {
        displayName: name
      });

      // Aguardar um pouco para garantir que o token esteja disponível
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar/atualizar usuário no backend
      await api.post('/users', {
        firebaseUid: result.user.uid,
        name,
        email,
        role
      });

      return result;
    } catch (error) {
      throw error;
    }
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  // Função para buscar perfil do usuário no backend
  const fetchUserProfile = async (firebaseUid) => {
    try {
      // Aguardar um pouco para garantir que o token esteja pronto
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await api.get(`/users/firebase/${firebaseUid}`);
      setUserProfile(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  };

  // Função para verificar se o token está válido
  const isTokenValid = async () => {
    try {
      if (!currentUser) return false;
      const token = await currentUser.getIdToken(true); // force refresh
      return !!token;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  };

  // Monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Aguardar um pouco para garantir que o token esteja disponível
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verificar se o token está válido
          const tokenValid = await isTokenValid();
          if (tokenValid) {
            // Buscar perfil do usuário no backend
            await fetchUserProfile(user.uid);
            setUserReady(true);
          } else {
            console.error('Token inválido após login');
            setUserReady(false);
          }
        } catch (error) {
          console.error('Erro ao inicializar usuário:', error);
          setUserReady(false);
        }
      } else {
        setUserProfile(null);
        setUserReady(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    userReady,
    loading,
    login,
    register,
    logout,
    fetchUserProfile,
    isTokenValid
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

