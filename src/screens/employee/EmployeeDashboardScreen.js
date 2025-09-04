import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

const EmployeeDashboardScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
 

  // Hook de autenticação real
  const { user, logout } = useAuth();

  useEffect(() => {
    // Verifica se é funcionário
    if (!user || (user.cargo !== "Estoquista" && user.cargo !== "Administrador")) {
      Alert.alert("Acesso Negado", "Esta área é exclusiva para funcionários.");
      navigation.replace("Login");
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Dados de dashboard carregados.");
    } catch (err) {
      setError("Erro ao carregar dashboard.");
      Alert.alert("Erro", "Falha ao carregar dados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("Login");
  };

  const dashboardOptions = [
    { title: "Lista de Funcionários", icon: "person-circle-outline", route: "EmployeeList" , onlyAdmin: true  },
    { title: "Gerenciar Produtos", icon: "cart-outline", route: "ProductManagement" },
    //{ title: "Relatórios de Vendas", icon: "bar-chart-outline", route: "SalesReports" },
  ];

 // Filtra opções baseadas no cargo do funcionário 
  const availableOptions = dashboardOptions.filter(
  (opt) => !opt.onlyAdmin || user?.cargo === "Administrador"
);

  const renderOption = (option) => (
    <TouchableOpacity
      key={option.title}
      style={styles.optionItem}
      onPress={() => navigation.navigate(option.route)}
    >
      <Ionicons name={option.icon} size={24} color="#2d5d3d" />
      <Text style={styles.optionText}>{option.title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header fixo com back, logo e logout */}
      <View style={styles.header}>
      
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logoHome.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appSlogan}>Backoffice - Bem-vindo, {user?.nome || "Funcionário"}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#b91c1c" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {isLoading ? (
            <Text style={styles.loadingText}>Carregando dashboard...</Text>
          ) : (
            <>
              <Text style={styles.headerText}>Opções Principais</Text>
              {availableOptions.map(renderOption)}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: { marginRight: 10 },
  logoutButton: { marginLeft: 10 },
  logoContainer: { flex: 1, alignItems: "center" },
  logo: {
         width: "100%",
    maxWidth: 400,
    height: 75,
    borderRadius: 10,
  },
  appSlogan: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  scrollView: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5d3d",
    marginBottom: 10,
  },
  optionItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderWidth: 1,
    marginVertical: 4,
    marginHorizontal: 8,
   // borderBottomColor: "#eee",
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  optionText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  loadingText: { textAlign: "center", color: "#666", marginVertical: 20 },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: { color: "#b91c1c", fontSize: 14 },
});

export default EmployeeDashboardScreen;