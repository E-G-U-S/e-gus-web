import AsyncStorage from '@react-native-async-storage/async-storage';

// Utilitários de validação
export const validateEmail = (email) => {
  
  if (!email || email.trim().length === 0) {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


//Senha
export const validatePassword = (password) => {
  if (!password) {
    return false;
  }
  const minLength = 8;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (
    password.length >= minLength &&
    hasLowerCase &&
    hasUpperCase &&
    hasDigit &&
    hasSymbol
  ) {
    return true;
  }
  return false;
};

export const isCpfValid = (cpf) => {
  if (!cpf) return false;
  const onlyNumbers = cpf.replace(/\D/g, '');
  if (onlyNumbers.length !== 11 || /^(\d)\1{10}$/.test(onlyNumbers)) {
    return false;
  }
 
  return true;
};


export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

// Utilitários de formatação
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options,
  };
  return new Intl.DateTimeFormat('pt-BR', defaultOptions).format(new Date(date));
};



// Utilitários de string
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Utilitários de array
export const sortByProperty = (array, property, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[property];
    const bValue = b[property];
    
    if (direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterByProperty = (array, property, value) => {
  return array.filter(item => 
    item[property].toString().toLowerCase().includes(value.toLowerCase())
  );
};

// Utilitários de objeto
export const removeEmptyFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => 
      value !== null && value !== undefined && value !== ''
    )
  );
};

// Utilitários de debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Utilitários de storage
export const storage = {
  set: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      // Para React Native, usar AsyncStorage
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Erro ao salvar no storage:', error);
    }
  },
  
  get: async (key) => {
    try {
      // Para React Native, usar AsyncStorage
      const jsonValue = await AsyncStorage.getItem(key);
      
      // Verificar se jsonValue não é null, undefined ou string vazia
      if (jsonValue && jsonValue !== 'undefined' && jsonValue.trim() !== '') {
        return JSON.parse(jsonValue);
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao ler do storage:', error);
      // Limpar dados corrompidos
      await AsyncStorage.removeItem(key);
      return null;
    }
  },
  
  remove: async (key) => {
    try {
      // Para React Native, usar AsyncStorage
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover do storage:', error);
    }
  },
};

// Gerador de IDs únicos
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Utilitário para delay/sleep
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};