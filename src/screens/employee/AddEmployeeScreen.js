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
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select"; // Import the picker library
import { useApp } from "../../context/AppContext";
import { Button, Input } from "../../components/ui";
import { employeeService } from "../../services/api";
import { EMPLOYEE_ROLES, getRoleLabel } from "../../constants";
import MessagePopup from "../../components/ui/MessagePopup";
import {
  validateEmail as isEmailValid,
  validatePassword as isPasswordValid
} from "../../utils";

// Helper for responsive scaling
const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const scale = (size) => (screenWidth / 375) * size;

const AddEmployeeScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // Initialize as empty for placeholder
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "" });
  const [activeTab, setActiveTab] = useState("register");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useApp();

  const validateEmailOnForm = (value) => {
    if (!value) {
      setEmailError("Email é obrigatório");
      return false;
    }
    // função centralizada!
    if (!isEmailValid(value)) {
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

    const validatePasswordOnForm = (value) => {
  
      if (!value) {
        setPasswordError("Senha é obrigatória");
        return false;
      }
      if (!isPasswordValid(value)) {
  
        setPasswordError("A senha deve ter 8+ caracteres, incluindo maiúscula, minúscula, número e símbolo.");
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
    setIsLoading(true);

    setNameError("");
    setEmailError("");
    setRoleError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const isNameValid = validateName(name);
    const isEmailValid = validateEmailOnForm(email);
    const isRoleValid = validateRole(role);
    const isPasswordValid = validatePasswordOnForm(password);
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
      const funcionarioData = {
        nome: name,
        email: email,
        senha: password,
        ativo: true,
        cargo: role,
        idMercado: user?.idMercado || 1,
      };

      console.log("Cadastrando funcionário:", funcionarioData);

      const response = await employeeService.create(funcionarioData);

      if (response.success) {
        setMessagePopup({
          visible: true,
          message: "Funcionário cadastrado com sucesso!",
          onClose: () => {
            setMessagePopup({ visible: false, message: "", onClose: null });
            navigation.goBack();
          },
        });
      } else {
        setMessagePopup({
          visible: true,
          message: response.error || "Falha ao cadastrar funcionário.",
        });
      }
    } catch (err) {
      console.error("Erro inesperado em handleRegister:", err);
      setMessagePopup({
        visible: true,
        message: "Erro ao conectar com o servidor. Tente novamente.",
      });
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
          validateEmailOnForm(text);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        isInvalid={!!emailError}
        errorMessage={emailError}
        style={styles.input}
      />
     <View style={styles.pickerContainer}>
  <View
    style={[
      styles.pickerWrapper,
      roleError ? styles.pickerError : null,
    ]}
  >
    {/* O ícone da esquerda continua aqui, mas seu estilo vai mudar no StyleSheet */}
 
   <Ionicons
 name="briefcase-outline"
 size={20}
color="#666"
 style={styles.pickerIcon}
 />
    
    <RNPickerSelect
      onValueChange={(value) => {
        setRole(value);
        validateRole(value);
      }}
      items={Object.values(EMPLOYEE_ROLES).map((r) => ({
        label: getRoleLabel(r),
        value: r,
      }))}
      
      // AQUI ESTÁ A MUDANÇA PRINCIPAL
      style={{
        // O input agora terá padding para os dois ícones
        inputIOS: styles.pickerInput,
        inputAndroid: styles.pickerInput,
        inputWeb: styles.pickerInput,
        
        // O placeholder usará o mesmo estilo do input para alinhar corretamente
        placeholder: {
          ...styles.pickerPlaceholder,
          ...styles.pickerInput, 
        },

        // O container do ícone da direita (seta) replicará o estilo do Input
        iconContainer: {
          position: 'absolute',
          top: '50%',
          right: 15,
          transform: [{ translateY: -10 }], // Centraliza o ícone de 20px de altura
        },
      }}

      value={role}
      placeholder={{ label: "Selecione um cargo", value: "" }}
     
    />
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
          validatePasswordOnForm(text);
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
              <Text style={styles.headerSubtext}>
                Preencha os dados para cadastrar um novo funcionário
              </Text>
            </View>
            {activeTab === "register" && renderRegisterForm()}
          </View>
          <MessagePopup
            visible={messagePopup.visible}
            message={messagePopup.message}
            onClose={messagePopup.onClose}
          />
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
      web: { alignItems: "center", justifyContent: "center" },
    }),
  },
  keyboardAvoidingView: {
    flex: 1,
    width: isWeb ? Math.min(screenWidth * 0.8, 600) : "100%",
  },
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
  formContainer: { marginBottom: 10, minHeight: 200 },
  input: { height: 42, borderRadius: 8, marginBottom: 8 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  button: { flex: 1, height: 50, borderRadius: 10 },
  cancelButton: { backgroundColor: "#dc2626" },
  registerButton: { backgroundColor: "#2d5d3d" },
  errorText: { color: "#b91c1c", fontSize: 14, marginTop: 4 },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
    pickerIcon: {
    position: 'absolute',    // Posição absoluta
    left: 15,                // 15px da esquerda
    top: '50%',              // Alinhamento vertical
    transform: [{ translateY: -10 }], // Ajuste fino vertical
    zIndex: 2,               // Garante que fique por cima
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Cor de fundo igual ao do Input
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0', // Borda padrão igual ao do Input
    position: 'relative',    // Necessário para o posicionamento absoluto dos filhos
    minHeight: 45,           // Altura mínima igual ao do Input
  },
  iconContainer: {
      position: 'absolute',
      right: 15,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    pickerInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: "transparent",
    paddingTop: 10,          // Padding vertical igual ao do Input
    paddingBottom: 10,       // Padding vertical igual ao do Input
    paddingLeft: 45,         // CRUCIAL: Espaço para o ícone da esquerda
    paddingRight: 45,
    ...Platform.select({
      web: {
        borderWidth: 0, // Remove a borda padrão do <select>
        outline: 'none',  // Remove a linha azul de foco do navegador
      }
    }),
 
  },
  pickerPlaceholder: {
    color: "#999",
  },
  pickerError: {
    borderColor: "#dc3545",
  },
});

export default AddEmployeeScreen;