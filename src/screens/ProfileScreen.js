"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth";


const ProfileScreen = ({ navigation }) => {
  
  const { user, logout, updateUserPreferences } = useAuth()

  const [notificationPreferences, setNotificationPreferences] = useState({
     promotions: user.preferences.notifications.promotions ?? true,
      priceUpdates: user.preferences.notifications.priceUpdates ?? true,
      newStores: user.preferences.notifications.newStores ?? true,
  })

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        onPress: () => {
          logout()
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        },
        style: "destructive",
      },
    ])
  }

  const handleToggleNotification = async (key, value) => {
    console.log('Switch alterado:', key, value)
    const newPreferences = {
      ...notificationPreferences,
      [key]: value,
    }

    setNotificationPreferences(newPreferences)

    console.log('Enviando updateUserPreferences:', {
      ...user.preferences,
      notifications: newPreferences,
    })
    const result = await updateUserPreferences({
      ...user.preferences,
      notifications: newPreferences,
    })
    console.log('Resposta do updateUserPreferences:', result)
  }

  const renderSettingsItem = (icon, title, onPress, showArrow = true) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={22} color="#666" style={styles.settingsItemIcon} />
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>

      {showArrow && <Ionicons name="chevron-forward" size={20} color="#ccc" />}
    </TouchableOpacity>
  )

  const renderSwitchItem = (icon, title, value, onValueChange) => (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemLeft}>
        <Ionicons name={icon} size={22} color="#666" style={styles.settingsItemIcon} />
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>

      <Switch
        trackColor={{ false: "#e0e0e0", true: "#a7d1b9" }}
        thumbColor={value ? "#2d5d3d" : "#f4f3f4"}
        ios_backgroundColor="#e0e0e0"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>

        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user?.profileImage || "https://via.placeholder.com/150?text=User" }}
              style={styles.profileImage}
            />

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.nome}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Editar perfil</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conta</Text>

          {renderSettingsItem("person-outline", "Informações pessoais", () => {})}
          {renderSettingsItem("home-outline", "Endereços", () => {})}
          {renderSettingsItem("lock-closed-outline", "Segurança", () => {})}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>

          {renderSwitchItem("pricetag-outline", "Promoções", notificationPreferences.promotions, (value) =>
            handleToggleNotification("promotions", value),
          )}

          {renderSwitchItem(
            "trending-down-outline",
            "Atualizações de preço",
            notificationPreferences.priceUpdates,
            (value) => handleToggleNotification("priceUpdates", value),
          )}

          {renderSwitchItem("storefront-outline", "Novos mercados", notificationPreferences.newStores, (value) =>
            handleToggleNotification("newStores", value),
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suporte</Text>

          {renderSettingsItem("help-circle-outline", "Central de ajuda", () => {})}
          {renderSettingsItem("chatbubble-outline", "Fale conosco", () => {})}
          {renderSettingsItem("document-text-outline", "Termos de uso", () => {})}
          {renderSettingsItem("shield-outline", "Política de privacidade", () => {})}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff6b6b" />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Versão 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  editProfileButton: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  editProfileText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsItemIcon: {
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff6b6b",
    fontWeight: "500",
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
})

export default ProfileScreen
