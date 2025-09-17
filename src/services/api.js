import { API_ENDPOINTS } from '../constants';

// Classe para extrair mensagens amigáveis dos erros
class ErrorHandler {
  static extractUserFriendlyMessage(error, responseText) {
    console.log('🔍 Extraindo mensagem de erro:', { error: error.message || error, responseText });

    try {
      // Tentar parsear a resposta como JSON
      let errorData = null;
      if (responseText) {
        try {
          errorData = JSON.parse(responseText);
          console.log('✅ Resposta parseada como JSON:', errorData);
        } catch (parseError) {
          console.log('⚠️ Não foi possível parsear resposta como JSON. Tratando como string simples.');
          if (typeof responseText === 'string' && responseText.trim()) {
            const simpleMessage = responseText.trim();
            if (this.isUserFriendlyMessage(simpleMessage)) {
              console.log('✅ Mensagem simples amigável encontrada:', simpleMessage);
              return simpleMessage;
            } else {
              console.log('❌ Mensagem simples não é amigável, usando fallback.');
            }
          }
        }
      }

      if (errorData && typeof errorData === 'object') {
        const possibleMessageFields = [
          'message',
          'error',
          'userMessage',
          'details',
          'error_description',
          'errorMessage'
        ];

        for (const field of possibleMessageFields) {
          if (errorData[field] && typeof errorData[field] === 'string') {
            const message = errorData[field].trim();
            if (this.isUserFriendlyMessage(message)) {
              console.log('✅ Mensagem amigável em campo JSON encontrada:', message);
              return message;
            }
          }
        }

        if (error && error.status) {
          return this.getStatusBasedMessage(error.status);
        }
      }


      if (error && error.status) {
        return this.getStatusBasedMessage(error.status);
      }

      if (error && error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Verifique sua conexão com a internet';
      }

      return 'Ocorreu um erro inesperado';

    } catch (extractError) {
      console.error('Erro ao extrair mensagem amigável:', extractError);
      return 'Ocorreu um erro inesperado';
    }
  }

  static isUserFriendlyMessage(message) {
    const technicalIndicators = [
      'Exception',
      'at ',
      'stack',
      'trace',
      'java.',
      'org.springframework',
      'Caused by',
      'com.example',
      '\tat ',
      'error_trace'
    ];

    const lowerMessage = message.toLowerCase();
    const hasTechnicalInfo = technicalIndicators.some(indicator =>
      lowerMessage.includes(indicator.toLowerCase())
    );

    const isTooLong = message.length > 200;

    return !hasTechnicalInfo && !isTooLong;
  }

  static getStatusBasedMessage(status) {
    const statusMessages = {
      400: 'Dados inválidos fornecidos',
      401: 'Email ou senha incorretos',
      403: 'Usuário inativo',
      404: 'Recurso não encontrado',
      409: 'Conflito de dados',
      422: 'Dados inválidos',
      429: 'Muitas tentativas, aguarde um momento',
      500: 'Erro interno do servidor',
      502: 'Serviço temporariamente indisponível',
      503: 'Serviço temporariamente indisponível',
    };

    return statusMessages[status] || 'Ocorreu um erro inesperado';
  }
}

// Configuração base da API
class ApiService {
  constructor() {
    this.baseURL = API_ENDPOINTS.base;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

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
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}, response:`, errorText);

        // Criar erro estruturado com informações necessárias
        const error = new Error('HTTP Error');
        error.status = response.status;
        error.statusText = response.statusText;
        error.responseText = errorText;

        // Extrair mensagem amigável - CORRIGIDO: passa o error e responseText
        const userMessage = ErrorHandler.extractUserFriendlyMessage(error, error.responseText);

        console.log('📝 Mensagem final para o usuário:', userMessage);

        return {
          success: false,
          error: userMessage,
          status: response.status
        };
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error('❌ Erro de rede ou fetch:', error);
      // Tratar erros de rede
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Erro de conexão: Verifique se o servidor está rodando em ' + this.baseURL
        };
      }

      // Para outros erros, usar a mensagem amigável
      const userMessage = ErrorHandler.extractUserFriendlyMessage(error);
      return { success: false, error: userMessage };
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
      console.error('Erro ao buscar token:', error);
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
        return { success: false, error: response.error };
      }

      // A API retorna diretamente os dados do usuário
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
      return { success: false, error: error.message || 'Erro ao conectar com o servidor' };
    }
  },

  async register(userData) {
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

  async updateUser(id, userData) {
    // userData deve conter todos os campos do usuário, inclusive preferences
    return apiService.put(API_ENDPOINTS.usuarios.update(id), userData);
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
      cargo: employeeData.cargo || 'EMPLOYEE',
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