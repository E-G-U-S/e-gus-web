import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { authService } from '../services/api';
import { storage } from '../utils';
import { STORAGE_KEYS } from '../constants';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    setUser, 
    setAuthenticated, 
    setLoading,
    logout: contextLogout,
    addNotification 
  } = useApp();
  
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setLoginLoading(true);
      setLoading(true);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        // Salvar token e dados do usuário
        await storage.set(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        await storage.set(STORAGE_KEYS.USER_DATA, response.data.user);
        
        // Atualizar contexto
        setUser(response.data.user);
        setAuthenticated(true);
        
        addNotification({
          type: 'success',
          title: 'Login realizado com sucesso!',
          message: `Bem-vindo(a), ${response.data.user.nome}!`
        });
        
        return { success: true, user: response.data.user };
      } else {
        addNotification({
          type: 'error',
          title: 'Erro no login',
          message: response.error || 'Credenciais inválidas'
        });
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      
      
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: 'Erro interno do servidor'
      });
      
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setLoginLoading(false);
      setLoading(false);
    }
  };

  const register = async (funcionarioData) => {
    try {
      setRegisterLoading(true);
      setLoading(true);
      
      const response = await authService.register(funcionarioData);
      
      if (response.success) {
        addNotification({
          type: 'success',
          title: 'Cadastro realizado com sucesso!',
          message: 'Funcionário cadastrado com sucesso'
        });
        
        return { success: true, data: response.data };
      } else {
        addNotification({
          type: 'error',
          title: 'Erro no cadastro',
          message: response.error || 'Erro ao cadastrar funcionário'
        });
        
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      addNotification({
        type: 'error',
        title: 'Erro no cadastro',
        message: 'Erro interno do servidor'
      });
      
      return { success: false, error: 'Erro interno do servidor' };
    } finally {
      setRegisterLoading(false);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Limpar dados locais
      await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER_DATA);
      
      // Atualizar contexto
      await contextLogout();
      
      addNotification({
        type: 'info',
        title: 'Logout realizado',
        message: 'Você foi desconectado com sucesso'
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await storage.get(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await storage.get(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        setUser(userData);
        setAuthenticated(true);
        return true;
      } else {
        setAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setAuthenticated(false);
      return false;
    }
  };

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    loginLoading,
    registerLoading,
    
    // Métodos
    login,
    register,
    logout,
    checkAuthStatus,
  };
};

export default useAuth;