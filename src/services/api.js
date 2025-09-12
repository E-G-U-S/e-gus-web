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
      console.log('Fazendo requisição para:', url, 'com a configuração:', config);
      const response = await fetch(url, config);
      
      // Tenta ler o corpo da resposta mesmo em caso de erro
      const responseBody = await response.text();

      if (!response.ok) {
        console.error(`Erro HTTP! status: ${response.status}, resposta: ${responseBody}`);
        try {
          const errorJson = JSON.parse(responseBody);
          throw new Error(errorJson.message || `Erro HTTP! status: ${response.status}`);
        } catch (e) {
          throw new Error(`Erro HTTP! status: ${response.status} - ${responseBody}`);
        }
      }
      
      const data = JSON.parse(responseBody);
      console.log('Resposta da API:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Erro na API:', error);
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
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Erro ao obter token:', error);
      return null;
    }
  }

  async setAuthToken(token) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('authToken', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  async removeAuthToken() {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }
}


export const apiService = new ApiService();

// --- SERVIÇOS ESPECÍFICOS ---

export const authService = {
 
  async login(payload) { 
    try {
      
      const response = await apiService.post(API_ENDPOINTS.auth.login, payload);

      if (!response.success) {
        return { success: false, error: response.error || 'Erro ao fazer login' };
      }

      const userData = response.data;

      if (!userData || !userData.id || !userData.nome || !userData.tipo) {
        return { success: false, error: 'Dados do usuário incompletos na resposta da API' };
      }
      const token = `token_simulado_${userData.id}_${Date.now()}`;
      await apiService.setAuthToken(token);

      return {
        success: true,
        data: {
          token,
          user: userData, 
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Erro ao conectar com o servidor' };
    }
  },

  async register(userData) {
    // A função de registro já estava correta.
    const requestData = {
      nome: userData.nome || userData.name,
      email: userData.email,
      senha: userData.senha || userData.password,
      cpf: userData.cpf,
    };
    return apiService.post(API_ENDPOINTS.auth.register, requestData);
  },

  async logout() {
    await apiService.removeAuthToken();
    return { success: true }; 
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
    const requestData = {
      nome: employeeData.nome || employeeData.name,
      email: employeeData.email,
      senha: employeeData.senha || employeeData.password,
      ativo: employeeData.ativo !== undefined ? employeeData.ativo : true,
      cargo: employeeData.cargo || 'ESTOQUISTA',
      idMercado: employeeData.idMercado || 1
    };
    return apiService.post(API_ENDPOINTS.funcionarios.create, requestData);
  },

  async update(id, employeeData) {
    const requestData = {
      nome: employeeData.nome || employeeData.name,
      email: employeeData.email,
      ativo: employeeData.ativo !== undefined ? employeeData.ativo : true,
      cargo: employeeData.cargo || 'ESTOQUISTA',
      idMercado: employeeData.idMercado || 1
    };
    
    if (employeeData.senha || employeeData.password) {
      requestData.senha = employeeData.senha || employeeData.password;
    }
    
    return apiService.put(API_ENDPOINTS.funcionarios.update(id), requestData);
  },

  async delete(id) {
    return apiService.delete(API_ENDPOINTS.funcionarios.delete(id));
  },
};

export const funcionarioService = employeeService;