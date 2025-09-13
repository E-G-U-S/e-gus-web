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
import { Button, Input, useErrorFeedback } from "../components/ui";
import ErrorFeedback from "../components/ui/ErrorFeedback";

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
  const [confirmPasswordError, setConfirmPasswordError] = useState}