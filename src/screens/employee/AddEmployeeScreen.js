import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { Button, Input } from "../../components/ui";
import { employeeService } from "../../services/api";
import { EMPLOYEE_ROLES, getRoleLabel } from "../../constants";

// Helper para % baseado na tela (simula responsive)
const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const scale = (size) => (screenWidth / 375) * size; // 375 como base (iPhone X width)




const AddEmployeeScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Estoquista");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("register"); // pra renderRegisterForm
const [isRegistering, setIsRegistering] = useState(false);
const [isLoading, setIsLoading] = useState(false);


  const { user } = useApp();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email é obrigatório");
      return false;
    } else if (!emailRegex.test(value)) {
      setEmailError("Email inválido");
      return false;
    }
    setEmailError("");
    return true;
  };



   const validateRole = (value) => {
    if (!value) {
      setRoleError("Cargo é obrigatório");
      return false;
    }
    setRoleError("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Senha é obrigatória");
      return false;
    }
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return false;
    } else if (!hasLowerCase || !hasUpperCase || !hasDigit || !hasSymbol) {
      setPasswordError("Inclua minúscula, maiúscula, número e símbolo");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const validateName = (value) => {
    if (!value) {
      setNameError("Nome é obrigatório");
      return false;
    }
    setNameError("");
    return true;
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Confirmação de senha é obrigatória");
      return false;
    } else if (value !== password) {
      setConfirmPasswordError("As senhas não coincidem");
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };



  const handleRegister = async () => {
  if (isRegistering || isLoading) {
    console.log("Registro já em andamento ou carregando, ignorando...");
    return;
  }

  setIsRegistering(true);
  setIsLoading(true); // Ativar estado de carregamento

  // Resetar erros
  setNameError("");
  setEmailError("");
  setRoleError("");
  setPasswordError("");
  setConfirmPasswordError("");

  // Validar todos os campos
  const isNameValid = validateName(name);
  const isEmailValid = validateEmail(email);
  const isRoleValid = validateRole(role);
  const isPasswordValid = validatePassword(password);
  const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

  if (
    !isNameValid ||
    !isEmailValid ||
    !isRoleValid ||
    !isPasswordValid ||
    !isConfirmPasswordValid
  ) {
    setIsRegistering(false);
    setIsLoading(false);
    return;
  }

  try {
    // Preparar dados conforme FuncionarioRequest do backend
    const funcionarioData = {
      nome: name,
      email: email,
      senha: password,
      ativo: true,
      cargo: role,
      idMercado: user?.idMercado || 1
    };
    
    console.log('Cadastrando funcionário:', funcionarioData);
    
    const response = await employeeService.create(funcionarioData);
    
    if (response.success) {
      Alert.alert("Sucesso", "Funcionário cadastrado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert("Erro", response.error || "Falha ao cadastrar funcionário.");
    }
  } catch (err) {
    console.error("Erro inesperado em handleRegister:", err);
    Alert.alert("Erro", "Erro ao conectar com o servidor. Tente novamente.");
  } finally {
    setIsRegistering(false);
    setIsLoading(false);
  }
};

  const renderRegisterForm = () => (
    <View style={styles.formContainer}>
      <Input
        label="Nome completo"
        leftIcon={<Ionicons name="person-outline" size={20} color="#666" />}
        value={name}
        onChangeText={(text) => {
          setName(text);
          validateName(text);
        }}
        isInvalid={!!nameError}
        errorMessage={nameError}
        style={styles.input}
      />
      <Input
        label="Email"
        leftIcon={<Ionicons name="mail-outline" size={20} color="#666" />}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          validateEmail(text);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        isInvalid={!!emailError}
        errorMessage={emailError}
        style={styles.input}
      />
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Cargo</Text>
        <View style={styles.pickerWrapper}>
          <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.pickerIcon} />
          <TouchableOpacity 
            style={[styles.pickerButton, roleError ? styles.pickerError : null]}
            onPress={() => {
              Alert.alert(
                "Selecionar Cargo",
                "Escolha o cargo do funcionário:",
                [
                  {
                    text: "Administrador",
                    onPress: () => {
                      setRole("Administrador");
                      validateRole("Administrador");
                    }
                  },
                  {
                    text: "Estoquista",
                    onPress: () => {
                      setRole("Estoquista");
                      validateRole("Estoquista");
                    }
                  },
                  {
                    text: "Cancelar",
                    style: "cancel"
                  }
                ]
              );
            }}
          >
            <Text style={[styles.pickerText, !role && styles.pickerPlaceholder]}>
              {role || "Selecione um cargo"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}
      </View>
      <Input
        label="Senha"
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        rightIcon={
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#666"
          />
        }
        onRightIconPress={() => setShowPassword(!showPassword)}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          validatePassword(text);
        }}
        secureTextEntry={!showPassword}
        isInvalid={!!passwordError}
        errorMessage={passwordError}
        style={styles.input}
      />
      <Input
        label="Confirmar senha"
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          validateConfirmPassword(text);
        }}
        secureTextEntry={!showPassword}
        isInvalid={!!confirmPasswordError}
        errorMessage={confirmPasswordError}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.cancelButton]}
        >
          Cancelar
        </Button>
        <Button
          onPress={handleRegister}
          loading={isLoading}
          style={[styles.button, styles.registerButton]}
          disabled={isLoading}
        >
          Cadastrar
        </Button>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/logoHome.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appSlogan}>
              Preencha as Informações do Funcionário para Cadastrar
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Novo Funcionário</Text>
              <Text style={styles.headerSubtext}>Preencha os dados para cadastrar um novo funcionário</Text>
            </View>
            {activeTab === "register" && renderRegisterForm()}

            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" ,
    ...Platform.select({
      web: { alignItems: 'center', justifyContent: 'center' }, // Centraliza no web
    }),
  },
  keyboardAvoidingView: { flex: 1, width: isWeb ? Math.min(screenWidth * 0.8, 600) : '100%', },
  scrollView: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 10 },
  logoContainer: { alignItems: "center", marginTop: 10, marginBottom: 5 },
  logo: {
    width: "100%",
    maxWidth: 200,
    height: 60,
    borderRadius: 10,
  },
  appSlogan: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
    marginBottom: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 5,
    marginHorizontal: 5,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d5d3d",
    marginBottom: 3,
  },
  headerSubtext: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#2d5d3d" },
  tabText: { fontSize: 16, fontWeight: "500", color: "#666" },
  activeTabText: { color: "#2d5d3d", fontWeight: "bold" },
  formContainer: { marginBottom: 10, minHeight: 200 },
  input: { height: 42, borderRadius: 8, marginBottom: 8 },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 10 },
  forgotPasswordText: { color: "#2d5d3d", fontSize: 14 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  button: { flex: 1, height: 50, borderRadius: 10 },
  cancelButton: { backgroundColor: "#dc2626" },
  registerButton: { backgroundColor: "#2d5d3d" },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: { color: "#b91c1c", fontSize: 14 },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { marginHorizontal: 8, color: "#666", fontSize: 14 },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 12,
  },
  pickerIcon: {
    marginRight: 12,
  },
  pickerButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  pickerPlaceholder: {
    color: "#999",
  },
  pickerError: {
    borderColor: "#dc3545",
  },
});

export default AddEmployeeScreen;