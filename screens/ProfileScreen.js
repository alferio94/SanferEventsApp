import {
  StyleSheet,
  Text,
  View,
  Switch,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Modal,
  Platform,
} from "react-native";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { showToast } from "../util/toast";
import { Ionicons } from "@expo/vector-icons";
import { GlobalStyles } from "../constants/styles";
import AuthService from "../services/AuthService";

const ProfileScreen = () => {
  const authCntx = useContext(AuthContext);
  const [isTogglingBiometric, setIsTogglingBiometric] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");

  async function toggleBiometric() {
    setIsTogglingBiometric(true);
    try {
      if (authCntx.isBiometricEnabled) {
        // Deshabilitar biometría
        const result = await authCntx.disableBiometric();
        if (result) {
          showToast(
            "success",
            "Biometría deshabilitada",
            "El acceso biométrico ha sido desactivado",
          );
        } else {
          showToast("error", "Error", "No se pudo desactivar la biometría");
        }
      } else {
        // Habilitar biometría - verificar si hay credenciales guardadas
        const credentials = await AuthService.getSavedCredentials();

        if (credentials) {
          // Tiene credenciales, puede habilitar directamente
          const result = await authCntx.enableBiometric();
          if (result) {
            showToast(
              "success",
              "Biometría habilitada",
              "Ahora puedes acceder con tu huella o Face ID",
            );
          } else {
            showToast("error", "Error", "No se pudo activar la biometría");
          }
        } else {
          // No tiene credenciales, pedir contraseña
          setIsTogglingBiometric(false); // Desactivar loading antes de mostrar prompt
          requestPasswordForBiometric();
        }
      }
    } catch (error) {
      showToast(
        "error",
        "Error",
        "No se pudo cambiar la configuración biométrica",
      );
    } finally {
      setIsTogglingBiometric(false);
    }
  }

  function requestPasswordForBiometric() {
    setPassword("");
    setShowPasswordModal(true);
  }

  function handleCancelPasswordModal() {
    setShowPasswordModal(false);
    setPassword("");
  }

  async function handleConfirmPassword() {
    if (!password || password.trim() === "") {
      showToast("error", "Error", "Debes ingresar tu contraseña");
      return;
    }

    setShowPasswordModal(false);
    await enableBiometricWithPassword(password);
    setPassword("");
  }

  async function enableBiometricWithPassword(password) {
    setIsTogglingBiometric(true);
    try {
      const result = await AuthService.enableBiometricWithPassword(
        authCntx.user.email,
        password,
      );

      if (result.success) {
        // Actualizar estado biométrico en el contexto
        await authCntx.refreshBiometricStatus();

        showToast(
          "success",
          "Biometría habilitada",
          "Ahora puedes acceder con tu huella o Face ID",
        );
      } else {
        showToast(
          "error",
          "Error",
          result.error || "No se pudo habilitar biometría",
        );
      }
    } catch (error) {
      showToast("error", "Error", "No se pudo habilitar la biometría");
    } finally {
      setIsTogglingBiometric(false);
    }
  }

  function handleTermsAndConditions() {
    Linking.openURL(
      "https://radiant-blancmange-87dd4b.netlify.app/#/privacy-policy",
    ).catch((err) => {
      Alert.alert("Error", "No se pudo abrir el enlace");
    });
  }

  function handleLogout() {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro de que quieres cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          onPress: authCntx.logout,
          style: "destructive",
        },
      ],
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header del perfil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons
            name="person-circle"
            size={80}
            color={GlobalStyles.primary500 || "#007AFF"}
          />
        </View>
        <Text style={styles.userName}>
          {authCntx.user?.name || authCntx.user?.email || "Usuario"}
        </Text>
        {authCntx.user?.email && authCntx.user?.name && (
          <Text style={styles.userEmail}>{authCntx.user.email}</Text>
        )}
      </View>

      {/* Información del usuario */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        {authCntx.user?.name && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={GlobalStyles.primary500 || "#007AFF"}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Nombre</Text>
                <Text style={styles.infoValue}>{authCntx.user.name}</Text>
              </View>
            </View>
          </View>
        )}

        {authCntx.user?.email && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={GlobalStyles.primary500 || "#007AFF"}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Correo electrónico</Text>
                <Text style={styles.infoValue}>{authCntx.user.email}</Text>
              </View>
            </View>
          </View>
        )}

        {authCntx.user?.id && (
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={GlobalStyles.primary500 || "#007AFF"}
                />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>ID de usuario</Text>
                <Text style={styles.infoValue}>{authCntx.user.id}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Configuraciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configuraciones</Text>

        <View style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color={GlobalStyles.primary500 || "#007AFF"}
                />
              </View>
              <View>
                <Text style={styles.settingTitle}>Acceso biométrico</Text>
                <Text style={styles.settingDescription}>
                  {authCntx.isBiometricEnabled ? "Habilitado" : "Deshabilitado"}
                </Text>
              </View>
            </View>
            <Switch
              value={authCntx.isBiometricEnabled}
              onValueChange={toggleBiometric}
              disabled={isTogglingBiometric}
              trackColor={{
                false: "#e0e0e0",
                true: GlobalStyles.primary100 || "#B3E5FC",
              }}
              thumbColor={
                authCntx.isBiometricEnabled
                  ? GlobalStyles.primary500 || "#007AFF"
                  : "#ffffff"
              }
            />
          </View>
        </View>
      </View>

      {/* Opciones adicionales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleTermsAndConditions}
        >
          <View style={styles.optionRow}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={GlobalStyles.primary500 || "#007AFF"}
              />
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>Política de Privacidad</Text>
              <Text style={styles.optionDescription}>
                Ver política de privacidad del servicio
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Botón de logout */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={24}
            color="white"
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Espaciado inferior */}
      <View style={styles.bottomSpacing} />

      {/* Modal para ingresar contraseña */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelPasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons
                name="shield-checkmark"
                size={40}
                color={GlobalStyles.primary500}
              />
              <Text style={styles.modalTitle}>Confirma tu identidad</Text>
              <Text style={styles.modalDescription}>
                Ingresa tu contraseña para habilitar la autenticación biométrica
              </Text>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                style={styles.modalInput}
                placeholder="Contraseña"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                autoFocus={true}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelPasswordModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmPassword}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e5e9",
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GlobalStyles.primary50 || "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  settingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#666",
  },
  optionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 30,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "85%",
    maxWidth: 400,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 12,
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 10,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#e1e5e9",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f1f3f5",
  },
  confirmButton: {
    backgroundColor: GlobalStyles.primary500 || "#007AFF",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

