// Configurações da API
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://192.168.18.50:8080', // mudar isso daqui ipconfi ipv4
  TIMEOUT: 10000,
};

// Endpoints da API
export const API_ENDPOINTS = {
  base: API_CONFIG.BASE_URL,
  auth: {
    login: '/login',
    register: '/funcionarios',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  funcionarios: {
    list: '/funcionarios',
    create: '/funcionarios',
    getById: (id) => `/funcionarios/${id}`,
    update: (id) => `/funcionarios/${id}`,
    delete: (id) => `/funcionarios/${id}`,
    login: '/login',
  },
  employees: {
    list: '/funcionarios',
    create: '/funcionarios',
    getById: (id) => `/funcionarios/${id}`,
    update: (id) => `/funcionarios/${id}`,
    delete: (id) => `/funcionarios/${id}`,
  },
};

// Cores do tema
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  
  // Tons de cinza
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Cores de fundo
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F1F3F4',
  },
  
  // Cores de texto
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  
  // Cores de borda
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
};

// Tamanhos de fonte
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Espaçamentos
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Breakpoints para responsividade
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Mensagens de validação
export const VALIDATION_MESSAGES = {
  required: 'Este campo é obrigatório',
  email: 'Digite um email válido',
  password: 'A senha deve ter pelo menos 6 caracteres',
  minLength: 'Deve ter pelo menos {min} caracteres',
  maxLength: 'Deve ter no máximo {max} caracteres',
  match: 'Os campos não coincidem',
};

// Status de funcionários
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

// Cargos de funcionários (baseado no enum Cargo do Spring Boot)
export const EMPLOYEE_ROLES = {
  ADMINISTRADOR: 'Administrador',
  ESTOQUISTA: 'Estoquista',
};

// Labels para cargos
export const ROLE_LABELS = {
  [EMPLOYEE_ROLES.ADMINISTRADOR]: 'Administrador',
  [EMPLOYEE_ROLES.ESTOQUISTA]: 'Estoquista',
};

// Mapeamento para compatibilidade com o backend
export const CARGO_MAPPING = {
  'Administrador': 'Administrador',
  'Estoquista': 'Estoquista',
};

// Função para obter label do cargo
export const getRoleLabel = (role) => {
  return ROLE_LABELS[role] || role;
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
};

// Configurações de storage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Rotas da aplicação
export const ROUTES = {
  LOGIN: 'Login',
  EMPLOYEE_LIST: 'EmployeeList',
  EMPLOYEE_DASHBOARD: 'EmployeeDashboard',
  ADD_EMPLOYEE: 'AddEmployee',
  EDIT_EMPLOYEE: 'EditEmployee',
};

// Configurações de animação
export const ANIMATION = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
  },
};