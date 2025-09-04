import { API_ENDPOINTS } from '../constants';

// Configuração base da API
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS.base;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  }

  // Método para fazer requisições HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token de autenticação se existir
    const token = await this.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      console.log('Making request to:', url, 'with config:', config);
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP error! status: ${response.status}, response: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return { success: true, data };
    } catch (error) {
      console.error('API Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, error: 'Erro de conexão: Verifique se o servidor está rodando em ' + this.baseURL };
      }
      return { success: false, error: error.message };
    }
  }

  // Métodos HTTP
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Gerenciamento de token
  async getAuthToken() {
    try {
      // Para React Native, usar AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  async setAuthToken(token) {
    try {
      // Para React Native, usar AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  async removeAuthToken() {
    try {
      // Para React Native, usar AsyncStorage
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }
}

// Instância singleton da API
export const apiService = new ApiService();

// Serviços específicos
export const authService = {
  async login(email, password) {
    try {
      const response = await apiService.post(API_ENDPOINTS.auth.login, {
        email,
        senha: password
      });
      
      if (!response.success) {
        return { success: false, error: response.error || 'Erro ao fazer login' };
      }
      
      // A API retorna diretamente os dados do usuário (id, cargo, nome)
      const userData = response.data;
      
      // Gerar um token simples para demonstração
      const token = `token_${userData.id}_${Date.now()}`;
      
      if (token) {
        await apiService.setAuthToken(token);
      }
      
      return {
        success: true,
        data: {
          token,
          user: userData
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Erro ao conectar com o servidor' };
    }
  },

  async register(funcionarioData) {
    // Mapear dados para o formato esperado pela API Spring Boot
    const requestData = {
      nome: funcionarioData.nome || funcionarioData.name,
      email: funcionarioData.email,
      senha: funcionarioData.senha || funcionarioData.password,
      ativo: funcionarioData.ativo !== undefined ? funcionarioData.ativo : true,
      cargo: funcionarioData.cargo || 'EMPLOYEE',
      idMercado: funcionarioData.idMercado || 1
    };
    
    return apiService.post(API_ENDPOINTS.funcionarios.create, requestData);
  },

  async logout() {
    await apiService.removeAuthToken();
    return apiService.post(API_ENDPOINTS.auth.logout);
  },

  async refreshToken() {
    return apiService.post(API_ENDPOINTS.auth.refresh);
  },
};

export const employeeService = {
  async getAll(idMercado = 1) {
    return apiService.get(API_ENDPOINTS.funcionarios.list, { idMercado });
  },

  async getById(id) {
    return apiService.get(API_ENDPOINTS.funcionarios.getById(id));
  },

  async create(employeeData) {
    // Mapear dados para o formato esperado pela API Spring Boot
    const requestData = {
      nome: employeeData.nome || employeeData.name,
      email: employeeData.email,
      senha: employeeData.senha || employeeData.password,
      ativo: employeeData.ativo !== undefined ? employeeData.ativo : true,
      cargo: employeeData.cargo || 'EMPLOYEE',
      idMercado: employeeData.idMercado || 1
    };
    return apiService.post(API_ENDPOINTS.funcionarios.create, requestData);
  },

  async update(id, employeeData) {
    // Mapear dados para o formato esperado pela API Spring Boot
    const requestData = {
      nome: employeeData.nome || employeeData.name,
      email: employeeData.email,
      ativo: employeeData.ativo !== undefined ? employeeData.ativo : true,
      cargo: employeeData.cargo || 'EMPLOYEE',
      idMercado: employeeData.idMercado || 1
    };
    
    // Só incluir senha se foi fornecida
    if (employeeData.senha || employeeData.password) {
      requestData.senha = employeeData.senha || employeeData.password;
    }
    
    return apiService.put(API_ENDPOINTS.funcionarios.update(id), requestData);
  },

  async delete(id) {
    return apiService.delete(API_ENDPOINTS.funcionarios.delete(id));
  },
};

// Alias para compatibilidade
export const funcionarioService = employeeService;