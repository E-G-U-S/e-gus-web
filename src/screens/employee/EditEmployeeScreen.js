import React, { useState, useEffect } from "react";
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
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../../context/AppContext";
import { Button, Input, } from "../../components/ui";
import { employeeService } from "../../services/api";
import { EMPLOYEE_ROLES, getRoleLabel } from "../../constants";
import MessagePopup from "../../components/ui/MessagePopup";
import {
  validateEmail as isEmailValid,
  validatePassword as isPasswordValid
} from "../../utils";
import RNPickerSelect from "react-native-picker-select";

// Helper para % baseado na tela (simula responsive)
const { width: screenWidth } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const scale = (size) => (screenWidth / 375) * size; // 375 como base (iPhone X width)

const EditEmployeeScreen = ({ navigation, route }) => {
  const { employee } = route.params || {};

  const [name, setName] = useState(employee?.name || "");
  const [email, setEmail] = useState(employee?.email || "");
  const [role, setRole] = useState(employee?.role || "Estoquista");
  const [isActive, setIsActive] = useState(employee?.isActive !== undefined ? employee.isActive : true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [roleError, setRoleError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messagePopup, setMessagePopup] = useState({ visible: false, message: "" });

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

  const validateConfirmPassword = (value) => {
    if (!value) {
      setConfirmPasswordError("Confirmação de senha é obrigatória");
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError("Senhas não coincidem");
      return false;
    }
    setConfirmPasswordError("");
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

  const validateName = (value) => {
    if (!value) {
      setNameError("Nome é obrigatório");
      return false;
    }
    setNameError("");
    return true;
  };



  const handleUpdate = async () => {
    if (isSubmitting || isLoading) {
      console.log("Atualização já em andamento ou carregando, ignorando...");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    // Resetar erros
    setNameError("");
    setEmailError("");
    setRoleError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Validar todos os campos
    const isNameValid = validateName(name);
    const isEmailValid = validateEmailOnForm(email);
    const isRoleValid = validateRole(role);
    const isPasswordValid = password ? validatePasswordOnForm(password) : true; // Senha opcional na edição
    const isConfirmPasswordValid = password ? validateConfirmPassword(confirmPassword) : true;

    if (!isNameValid || !isEmailValid || !isRoleValid || !isPasswordValid || !isConfirmPasswordValid) {
      setIsSubmitting(false);
      setIsLoading(false);
      return;
    }

    try {
      // Preparar dados para envio conforme FuncionarioRequest do backend
      const updateData = {
        nome: name,
        email: email,
        ativo: isActive,
        cargo: role,
        idMercado: user?.idMercado || 1,
        ...(password && { senha: password }) // Incluir senha apenas se fornecida
      };

      console.log('Atualizando funcionário:', { id: employee.id, ...updateData });

      const response = await employeeService.update(employee.id, updateData);

      if (response.success) {
        setMessagePopup({
          visible: true,
          message: password ? "Funcionário e senha atualizados com sucesso!" : "Funcionário atualizado com sucesso!",
          onClose: () => navigation.navigate('EmployeeList')
        });
      } else {
        setMessagePopup({ visible: true, message: response.error || "Erro ao atualizar funcionário" });
      }
    } catch (err) {
      console.error("Erro inesperado em handleUpdate:", err);
      setMessagePopup({ visible: true, message: "Erro ao conectar com o servidor. Tente novamente." });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const renderEditForm = () => (
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
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
              inputWeb: styles.pickerInput,
              placeholder: {
                ...styles.pickerPlaceholder,
                ...styles.pickerInput,
              },
              iconContainer: {
                position: 'absolute',
                right: 15,
                top: 0,
                bottom: 0,
                justifyContent: 'center',
              },
            }}
            value={role}
            placeholder={{ label: "Selecione um cargo", value: "" }}
          />
        </View>
        {roleError ? <Text style={styles.errorText}>{roleError}</Text> : null}
      </View>

      <Input
        label="Nova Senha (opcional)"
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (text) validatePasswordOnForm(text);
        }}
        secureTextEntry
        isInvalid={!!passwordError}
        errorMessage={passwordError}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <Input
        label="Confirmar Nova Senha"
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          if (password && text) validateConfirmPassword(text);
        }}
        secureTextEntry
        isInvalid={!!confirmPasswordError}
        errorMessage={confirmPasswordError}
        style={styles.input}
        placeholderTextColor="#999"
      />
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.goBack()}
          style={[styles.button, styles.cancelButton]}
        >
          Cancelar
        </Button>
        <Button
          onPress={handleUpdate}
          loading={isLoading}
          style={[styles.button, styles.updateButton]}
          disabled={isLoading}
        >
          Atualizar
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
              Atualize as informações do funcionário
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Editar Funcionário</Text>
              {employee && (
                <View style={styles.headerInfoContainer}>
                  <Text style={styles.employeeId}>ID: {employee.id}</Text>
                  <TouchableOpacity
                    style={styles.statusIndicator}
                    onPress={() => setIsActive(!isActive)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={isActive ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={isActive ? "#16a34a" : "#dc2626"}
                      style={styles.statusIcon}
                    />
                    <Text style={[styles.statusText, isActive ? styles.activeText : styles.inactiveText]}>
                      {isActive ? "Ativo" : "Inativo"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.headerSubtext}>Modifique os dados necessários e salve as alterações</Text>
            </View>
            {renderEditForm()}
          </View>
            <MessagePopup
              visible={messagePopup.visible}
              message={messagePopup.message}
              onClose={() => {
                setMessagePopup({ visible: false, message: "" });
                if (messagePopup.onClose) messagePopup.onClose();
              }}
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
      web: { alignItems: 'center', justifyContent: 'center' },
    }),
  },
  keyboardAvoidingView: {
    flex: 1,
    width: isWeb ? Math.min(screenWidth * 0.8, 600) : '100%',
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 10
  },
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
  headerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginBottom: 5,
  },
  employeeId: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  formContainer: { marginBottom: 10, minHeight: 200 },
  input: { height: 42, borderRadius: 8, marginBottom: 8 },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#666",
  },
  activeText: {
    color: "#16a34a",
  },
  inactiveText: {
    color: "#dc2626",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  button: { flex: 1, height: 44, borderRadius: 8 },
  cancelButton: {
    backgroundColor: "#dc2626"
  },
  updateButton: {
    backgroundColor: "#2d5d3d"
  },
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
    position: 'absolute',
    left: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 2,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    position: 'relative',
    minHeight: 45,
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
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 45,
    paddingRight: 45,
    ...Platform.select({
      web: {
        borderWidth: 0,
        outline: 'none',
      }
    }),
  },
  pickerPlaceholder: {
    color: "#999",
  },
  pickerError: {
    borderColor: "#dc3545",
  },
  errorText: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
});

export default EditEmployeeScreen;