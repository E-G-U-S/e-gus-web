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

      console.log('🔐 useAuth: Iniciando login para:', email);

      const response = await authService.login(email, password);

      if (response.success) {
        console.log('✅ useAuth: Login bem-sucedido');

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
        console.log('❌ useAuth: Login falhou com erro:', response.error);

        // Usar a mensagem de erro amigável que já foi tratada pela API
        addNotification({
          type: 'error',
          title: 'Erro no login',
          message: response.error // Esta mensagem já foi tratada pelo ErrorHandler
        });

        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('💥 useAuth: Erro inesperado no login:', error);

      // Fallback para erros não tratados
      const errorMessage = 'Erro inesperado ao tentar fazer login';

      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: errorMessage
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoginLoading(false);
      setLoading(false);
    }
  };

  const register = async (funcionarioData) => {
    try {
      setRegisterLoading(true);
      setLoading(true);

      console.log('📝 useAuth: Iniciando registro para:', funcionarioData.email);

      const response = await authService.register(funcionarioData);

      if (response.success) {
        console.log('✅ useAuth: Registro bem-sucedido');

        addNotification({
          type: 'success',
          title: 'Cadastro realizado com sucesso!',
          message: 'Funcionário cadastrado com sucesso'
        });

        return { success: true, data: response.data };
      } else {
        console.log('❌ useAuth: Registro falhou com erro:', response.error);

        // Usar a mensagem de erro amigável que já foi tratada pela API
        addNotification({
          type: 'error',
          title: 'Erro no cadastro',
          message: response.error // Esta mensagem já foi tratada pelo ErrorHandler
        });

        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('💥 useAuth: Erro inesperado no registro:', error);

      // Fallback para erros não tratados
      const errorMessage = 'Erro inesperado ao tentar cadastrar';

      addNotification({
        type: 'error',
        title: 'Erro no cadastro',
        message: errorMessage
      });

      return { success: false, error: errorMessage };
    } finally {
      setRegisterLoading(false);
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      console.log('🚪 useAuth: Fazendo logout');

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
      console.error('💥 useAuth: Erro no logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    } finally {
      setLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 useAuth: Verificando status de autenticação');

      const token = await storage.get(STORAGE_KEYS.AUTH_TOKEN);
      const userData = await storage.get(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        console.log('✅ useAuth: Usuário autenticado encontrado');
        setUser(userData);
        setAuthenticated(true);
        return true;
      } else {
        console.log('❌ useAuth: Nenhuma autenticação encontrada');
        setAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('💥 useAuth: Erro ao verificar status de autenticação:', error);
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