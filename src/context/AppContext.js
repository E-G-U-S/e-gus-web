import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils';
import { STORAGE_KEYS } from '../constants';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  theme: 'light',
  language: 'pt-BR',
  employees: [],
  notifications: [],
};

// Tipos de ações
const ActionTypes = {
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_LOADING: 'SET_LOADING',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  REMOVE_EMPLOYEE: 'REMOVE_EMPLOYEE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
      
    case ActionTypes.SET_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
      
    case ActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };
      
    case ActionTypes.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
      
    case ActionTypes.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload,
      };
      
    case ActionTypes.ADD_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, action.payload],
      };
      
    case ActionTypes.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp => 
          emp.id === action.payload.id ? action.payload : emp
        ),
      };
      
    case ActionTypes.REMOVE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.filter(emp => emp.id !== action.payload),
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...action.payload,
        }],
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
      
    case ActionTypes.RESET_STATE:
      return {
        ...initialState,
        isLoading: false,
      };
      
    default:
      return state;
  }
};

// Contexto
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar dados persistidos na inicialização
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Persistir dados importantes quando mudarem
  useEffect(() => {
    if (state.user) {
      storage.set(STORAGE_KEYS.USER_DATA, state.user);
    }
  }, [state.user]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.THEME, state.theme);
  }, [state.theme]);

  useEffect(() => {
    storage.set(STORAGE_KEYS.LANGUAGE, state.language);
  }, [state.language]);

  const loadPersistedData = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      
      // Carregar dados do usuário
      const userData = await storage.get(STORAGE_KEYS.USER_DATA);
      const authToken = await storage.get(STORAGE_KEYS.AUTH_TOKEN);
      
      if (userData && authToken) {
        dispatch({ type: ActionTypes.SET_USER, payload: userData });
        dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: true });
      }
      
      // Carregar preferências
      const theme = await storage.get(STORAGE_KEYS.THEME);
      if (theme) {
        dispatch({ type: ActionTypes.SET_THEME, payload: theme });
      }
      
      const language = await storage.get(STORAGE_KEYS.LANGUAGE);
      if (language) {
        dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language });
      }
      
    } catch (error) {
      console.error('Erro ao carregar dados persistidos:', error);
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Actions
  const actions = {
    // Autenticação
    setUser: (user) => {
      dispatch({ type: ActionTypes.SET_USER, payload: user });
    },
    
    setAuthenticated: (isAuthenticated) => {
      dispatch({ type: ActionTypes.SET_AUTHENTICATED, payload: isAuthenticated });
    },
    
    logout: async () => {
      await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER_DATA);
      dispatch({ type: ActionTypes.RESET_STATE });
    },
    
    // UI
    setLoading: (isLoading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: isLoading });
    },
    
    setTheme: (theme) => {
      dispatch({ type: ActionTypes.SET_THEME, payload: theme });
    },
    
    setLanguage: (language) => {
      dispatch({ type: ActionTypes.SET_LANGUAGE, payload: language });
    },
    
    // Funcionários
    setEmployees: (employees) => {
      dispatch({ type: ActionTypes.SET_EMPLOYEES, payload: employees });
    },
    
    addEmployee: (employee) => {
      dispatch({ type: ActionTypes.ADD_EMPLOYEE, payload: employee });
    },
    
    updateEmployee: (employee) => {
      dispatch({ type: ActionTypes.UPDATE_EMPLOYEE, payload: employee });
    },
    
    removeEmployee: (employeeId) => {
      dispatch({ type: ActionTypes.REMOVE_EMPLOYEE, payload: employeeId });
    },
    
    // Notificações
    addNotification: (notification) => {
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification });
    },
    
    removeNotification: (notificationId) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: notificationId });
    },
    
    clearNotifications: () => {
      dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de um AppProvider');
  }
  return context;
};

export default AppContext;