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
import { useApp } from "../context/AppContext";
import { useAuth } from "../hooks/useAuth";
import { Button, Input } from "../components/ui";

// Helper para % baseado na tela (simula responsive)
const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const scale = (size) => (screenWidth / 375) * size; // 375 como base (iPhone X width)

const LoginScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const { addNotification } = useApp();
  const { login, register, loginLoading, registerLoading, isLoading } = useAuth();

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

  const validatePassword = (value) => {
    if (!value) {
      setPasswordError("Senha é obrigatória");
      return false;
    }
    const hasLowerCase = /[a-z]/.test(value);
    const hasUpperCase = /[A-Z]/.test(value);
    const hasDigit = /\d/.test(value);
    //const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (value.length < 8) {
      setPasswordError("A senha deve ter pelo menos 8 caracteres");
      return false;
    } //else if (!hasLowerCase || !hasUpperCase || !hasDigit || !hasSymbol) {
      //setPasswordError("Inclua minúscula, maiúscula, número e símbolo");
      ///return false;
    
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

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    if (!isEmailValid || !isPasswordValid) return;

    console.log("Tentando login com:", { email });
    const result = await login(email, password);
    
    if (result.success) {
      // Login bem-sucedido, navegar para a tela principal
      navigation.navigate("EmployeeDashboard");
    } else {
      // Erro já foi tratado pelo hook useAuth com notificação
      console.log("Erro no login:", result.error);
    }
  };

  const handleRegister = async () => {
    if (registerLoading || isLoading) {
      console.log("Registro já em andamento ou carregando, ignorando...");
      return;
    }

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    console.log("Tentando registrar:", { name, email, password: "****" });
    
    const funcionarioData = {
      nome: name,
      email: email,
      senha: password,
      ativo: true,
      cargo: 'EMPLOYEE',
      idMercado: 1
    };
    
    const result = await register(funcionarioData);
    
    if (result.success) {
      console.log("Funcionário cadastrado com sucesso");
      // Limpar formulário
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      // Voltar para aba de login
      setActiveTab("login");
    } else {
      console.log("Erro no registro:", result.error);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert("Em desenvolvimento", `Login com ${provider} em desenvolvimento.`);
  };

  const renderLoginForm = () => (
    <View style={styles.formContainer}>
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
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
      </TouchableOpacity>
      <Button
        onPress={handleLogin}
        loading={loginLoading}
        style={styles.button}
        disabled={loginLoading}
      >
        Entrar
      </Button>
    </View>
  );

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
      <Button
        onPress={handleRegister}
        loading={registerLoading}
        style={styles.button}
        disabled={registerLoading}
      >
        Cadastrar
      </Button>
    </View>
  );

  console.log("LoginScreen renderizada, estados:", { email, name, loginLoading, registerLoading });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appSlogan}>
              Compare preços e economize nas compras
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "login" && styles.activeTab]}
                onPress={() => setActiveTab("login")}
              >
                <Text
                  style={[styles.tabText, activeTab === "login" && styles.activeTabText]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              {
              <TouchableOpacity
                style={[styles.tab, activeTab === "register" && styles.activeTab]}
                onPress={() => setActiveTab("register")}
              >
                <Text
                  style={[styles.tabText, activeTab === "register" && styles.activeTabText]}
                >
                  Cadastro
                </Text>
              </TouchableOpacity>
              }
            </View>
            {activeTab === "login" && renderLoginForm()}
            {activeTab === "register" && renderRegisterForm()}

            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>ou continue com</Text>
              <View style={styles.divider} />
            </View>
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Google")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-google" size={20} color="#333" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialLogin("Facebook")}
                activeOpacity={0.8}
              >
                <Ionicons name="logo-facebook" size={20} color="#3b5998" />
                <Text style={styles.socialButtonText}>Facebook</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...Platform.select({
      web: { alignItems: 'center', justifyContent: 'center' }, // Centraliza no web
    }),
  },
  keyboardAvoidingView: { flex: 1, width: isWeb ? Math.min(screenWidth * 0.8, 600) : '100%', },
  scrollView: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 10 },
  logoContainer: { alignItems: "center", marginTop: 10, marginBottom: 0 },
  logo: {
    width: "100%",
    maxWidth: 400,
    height: 175,
    borderRadius: 20,
  },
  appSlogan: {
    fontSize: 14,
    color: "#666",
    marginTop: 0,
    marginBottom: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#2d5d3d" },
  tabText: { fontSize: 16, fontWeight: "500", color: "#666" },
  activeTabText: { color: "#2d5d3d", fontWeight: "bold" },
  formContainer: { marginBottom: 10, minHeight: 250 },
  input: { height: 45, borderRadius: 8, marginBottom: 8 },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 10 },
  forgotPasswordText: { color: "#2d5d3d", fontSize: 14 },
  button: { marginTop: 8, backgroundColor: "#2d5d3d", height: 45, borderRadius: 8 },
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
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: "48%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  socialButtonText: { marginLeft: 6, fontSize: 14, fontWeight: "500", color: "#333" },
});

export default LoginScreen;