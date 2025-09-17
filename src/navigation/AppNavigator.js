import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, ROUTES } from '../constants';
import CustomBottomTabBar from '../components/ui/CustomBottomTabBar';


// Importar telas
import LoginScreen from '../screens/LoginScreen';
import EmployeeListScreen from '../screens/employee/EmployeeListScreen';
import EmployeeDashboardScreen from '../screens/employee/EmployeeDashboardScreen';
import AddEmployeeScreen from '../screens/employee/AddEmployeeScreen';
import EditEmployeeScreen from '../screens/employee/EditEmployeeScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductSearchScreen from '../screens/ProductSearchScreen';
import ProductComparisonScreen from '../screens/ProductComparisonScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Configurações padrão para as telas do StackNavigator
const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: COLORS.primary,
  },
  headerTintColor: COLORS.text.inverse,
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  headerBackTitleVisible: false,
};

// Configurações específicas para cada tela
const screenConfigs = {
  [ROUTES.LOGIN]: {
    title: 'Login',
    headerShown: false,
  },
  [ROUTES.EMPLOYEE_LIST]: {
    title: 'Lista de Funcionários',
    headerLeft: null, // Remove botão de voltar
  },
  [ROUTES.PRODUCT_SEARCH]: {
    title: 'Buscar Produto',
  },
  [ROUTES.PRODUCT_COMPARISON]: {
    title: 'Comparação de Produtos',
  },

  [ROUTES.EMPLOYEE_DASHBOARD]: {
    title: 'Dashboard',
  },
  [ROUTES.ADD_EMPLOYEE]: {
    title: 'Adicionar Funcionário',
  },
  [ROUTES.EDIT_EMPLOYEE]: {
    title: 'Editar Funcionário',
  },
  [ROUTES.HOME]: {
    title: 'Home',
  },
  [ROUTES.PROFILE]: {
    title: 'Perfil',
  },
};

// Navegador de abas
const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false, 
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={ProductSearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Navegador principal
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.LOGIN}
        screenOptions={{headerShown: false }}
      >
        <Stack.Screen
          name={ROUTES.LOGIN}
          component={LoginScreen}
          options={screenConfigs[ROUTES.LOGIN]}
        />
        <Stack.Screen
          name={ROUTES.HOME}
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name={ROUTES.PRODUCT_COMPARISON}
          component={ProductComparisonScreen}
          options={screenConfigs[ROUTES.PRODUCT_COMPARISON]}
        />
        <Stack.Screen
          name={ROUTES.EMPLOYEE_LIST}
          component={EmployeeListScreen}
          options={screenConfigs[ROUTES.EMPLOYEE_LIST]}
        />
        <Stack.Screen
          name={ROUTES.EMPLOYEE_DASHBOARD}
          component={EmployeeDashboardScreen}
          options={screenConfigs[ROUTES.EMPLOYEE_DASHBOARD]}
        />
        <Stack.Screen
          name={ROUTES.ADD_EMPLOYEE}
          component={AddEmployeeScreen}
          options={screenConfigs[ROUTES.ADD_EMPLOYEE]}
        />
        <Stack.Screen
          name={ROUTES.EDIT_EMPLOYEE}
          component={EditEmployeeScreen}
          options={screenConfigs[ROUTES.EDIT_EMPLOYEE]}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;