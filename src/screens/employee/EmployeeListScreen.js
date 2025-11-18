import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { Button } from "../../components/ui";
import { employeeService } from "../../services/api";
import { getRoleLabel } from "../../constants";
import SearchBar from "../../components/ui/SearchBar"; 

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const scale = (size) => (screenWidth / 375) * size;

const EmployeeListScreen = ({ navigation }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useApp();

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Atualizar lista quando a tela receber foco (após editar/adicionar funcionário)
  useFocusEffect(
    React.useCallback(() => {
      fetchEmployees();
    }, [])
  );

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const idMercado = user?.idMercado;
      const response = await employeeService.getAll(idMercado);
      
      if (response.success) {
        // Mapear dados da API para o formato esperado pelo frontend
        const mappedEmployees = response.data.map(funcionario => ({
          id: funcionario.id.toString(),
          name: funcionario.nome,
          email: funcionario.email,
          role: funcionario.cargo,
          ativo: funcionario.ativo,
          idMercado: funcionario.idMercado
        }));
        
        setEmployees(mappedEmployees);
        setFilteredEmployees(mappedEmployees);
      } else {
        setError(response.error || 'Erro ao carregar funcionários');
        setEmployees([]);
        setFilteredEmployees([]);
      }
    } catch (error) {
      console.error("Erro ao buscar funcionários:", error);
      setError("Erro ao conectar com o servidor");
      setEmployees([]);
      setFilteredEmployees([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (employee) =>
          employee.name.toLowerCase().includes(query.toLowerCase()) ||
          employee.role.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredEmployees(employees);
  };

  const handleAddEmployee = () => {
    navigation.navigate("AddEmployee");
  };

  const handleViewEmployee = (employee) => {
    navigation.navigate("EditEmployee", { employee });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity style={styles.employeeItem} onPress={() => handleViewEmployee(item)}>
      <View style={styles.employeeContent}>
        <View style={styles.employeeHeader}>
          <Ionicons name="person-circle-outline" size={28} color="#2d5d3d" />
          <View style={styles.employeeNameRole}>
            <Text style={styles.employeeId}>ID: {item.id}</Text>
            <Text style={styles.employeeName}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.employeeDetails}>
          <Text style={styles.employeeRole}>{item.role}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#2d5d3d" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/logoHome.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appSlogan}>Gerencie sua equipe de forma eficiente</Text>
        </View>
      </View>

      <View style={styles.card}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Lista de Funcionários</Text>
          <Button onPress={handleAddEmployee} style={styles.addButton}>
            Adicionar
          </Button>
        </View>

        {/* Integração do SearchBar customizado */}
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={(query) => handleSearch(query)} // Chama handleSearch diretamente no onChangeText
          placeholder="Pesquisar por nome ou cargo"
          autoFocus={false}
          onSearch={null} // Não usado, pois busca é em tempo real
          style={styles.searchContainerOverride} // Opcional: estilo extra se precisar
        />

        {isLoading ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : filteredEmployees.length === 0 ? (
          <Text style={styles.emptyText}>
            {searchQuery ? "Nenhum funcionário corresponde à pesquisa." : "Nenhum funcionário encontrado."}
          </Text>
        ) : (
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeItem}
            keyExtractor={(item) => item.id}
            numColumns={isWeb ? 2 : 1}
            columnWrapperStyle={isWeb ? { justifyContent: "space-between", paddingHorizontal: 8 } : null}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
  },
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
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    margin: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5d3d",
  },
  addButton: {
    backgroundColor: "#2d5d3d",
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  // Estilo opcional para override no SearchBar (ex: marginBottom)
  searchContainerOverride: {
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  employeeItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flex: isWeb ? 1 : null,
    ...(isWeb && {
      transition: "all 0.2s",
      ":hover": {
        shadowOpacity: 0.1,
        backgroundColor: "#f0f0f0",
      },
    }),
  },
  employeeContent: {
    flex: 1,
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  employeeNameRole: {
    marginLeft: 8,
  },
  employeeId: {
    fontSize: 12,
    color: "#666",
  },
  employeeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  employeeDetails: {
    paddingLeft: 36,
  },
  employeeRole: {
    fontSize: 13,
    color: "#444",
  },
  loadingText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#b91c1c",
    fontSize: 14,
  },
});

export default EmployeeListScreen;