import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES, COLORS } from '../constants';

// Importar telas
import LoginScreen from '../screens/LoginScreen';
import EmployeeListScreen from '../screens/employee/EmployeeListScreen';
import EmployeeDashboardScreen from '../screens/employee/EmployeeDashboardScreen';
import AddEmployeeScreen from '../screens/employee/AddEmployeeScreen';
import EditEmployeeScreen from '../screens/employee/EditEmployeeScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

// Configurações padrão para as telas
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
  [ROUTES.EMPLOYEE_DASHBOARD]: {
    title: 'Dashboard',
  },
  [ROUTES.ADD_EMPLOYEE]: {
    title: 'Adicionar Funcionário',
  },
  [ROUTES.EDIT_EMPLOYEE]: {
    title: 'Editar Funcionário',
  },
  [ROUTES.HOME]:{
      title: 'Home',
  }
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.LOGIN}
        screenOptions={defaultScreenOptions}
      >
        <Stack.Screen
          name={ROUTES.LOGIN}
          component={LoginScreen}
          options={screenConfigs[ROUTES.LOGIN]}
        />

       <Stack.Screen
  name={ROUTES.HOME}
  component={HomeScreen}
  options={{ ...screenConfigs[ROUTES.HOME], headerShown: false }}
/>
        
        <Stack.Screen
          name={ROUTES.EMPLOYEE_LIST}
          component={EmployeeListScreen}
          
          options={{
            ...screenConfigs[ROUTES.EMPLOYEE_LIST],
            headerShown: false
          }}
        />
        
        <Stack.Screen
          name={ROUTES.EMPLOYEE_DASHBOARD}
          component={EmployeeDashboardScreen}
          options={{
            ...screenConfigs[ROUTES.EMPLOYEE_DASHBOARD],
            headerShown: false
          }}
        />
        
        <Stack.Screen
          name={ROUTES.ADD_EMPLOYEE}
          component={AddEmployeeScreen}
          options={{
            ...screenConfigs[ROUTES.ADD_EMPLOYEE],
            headerShown: false
          }}
        />
        
        <Stack.Screen
          name={ROUTES.EDIT_EMPLOYEE}
          component={EditEmployeeScreen}
          options={{
            ...screenConfigs[ROUTES.EDIT_EMPLOYEE],
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;