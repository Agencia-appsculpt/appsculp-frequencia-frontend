import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
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
      console.log('Buscando perfil do usuário:', firebaseUid);
      const response = await api.get(`/users/firebase/${firebaseUid}`);
      console.log('Perfil encontrado:', response.data);
      setUserProfile(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  };

  // Função para verificar se o token está válido
  const isTokenValid = async (user) => {
    try {
      if (!user) return false;
      const token = await user.getIdToken(true); // force refresh
      console.log('Token válido obtido');
      return !!token;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  };

  // Função para resetar a senha
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'No user');
      setCurrentUser(user);
      
      if (user) {
        try {
          console.log('Usuário autenticado, verificando token...');
          
          // Verificar se o token está válido
          const tokenValid = await isTokenValid(user);
          if (tokenValid) {
            console.log('Token válido, buscando perfil...');
            // Buscar perfil do usuário no backend
            await fetchUserProfile(user.uid);
            setUserReady(true);
            console.log('Usuário pronto!');
          } else {
            console.error('Token inválido após login');
            setUserReady(false);
          }
        } catch (error) {
          console.error('Erro ao inicializar usuário:', error);
          setUserReady(false);
        }
      } else {
        console.log('Usuário deslogado');
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
    isTokenValid,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

