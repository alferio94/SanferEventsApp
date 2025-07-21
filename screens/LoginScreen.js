import { StyleSheet, Text, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GlobalStyles } from "../constants/styles";
import { ButtonCustom } from "../components/ui/ButtonCustom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const authCntx = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [loginOptions, setLoginOptions] = useState({
    biometricSupported: false,
    biometricEnabled: false,
    hasCredentials: false,
    canUseBiometric: false
  });

  // Verificar opciones de login disponibles al cargar
  useEffect(() => {
    checkLoginOptions();
  }, []);

  const checkLoginOptions = async () => {
    try {
      const options = await authCntx.getLoginOptions();
      setLoginOptions(options);
    } catch (error) {
      console.error('Error checking login options:', error);
    }
  };

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setFormData((currentInputs) => {
      return {
        ...currentInputs,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  async function loginConfirm() {
    if (!formData.email.trim() || !formData.password.trim()) {
      Alert.alert(
        "Campos requeridos",
        "Por favor ingresa email y contraseña"
      );
      return;
    }

    try {
      const result = await authCntx.login(
        formData.email.trim().toLowerCase(),
        formData.password,
        saveCredentials
      );

      if (!result.success) {
        Alert.alert(
          "Error de autenticación",
          result.error || "Credenciales inválidas"
        );
      }
      // Si es exitoso, el contexto manejará la navegación
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        "Error de conexión",
        "No se pudo conectar con el servidor. Intenta nuevamente."
      );
    }
  }

  async function biometricLogin() {
    try {
      const result = await authCntx.loginWithBiometrics();
      
      if (!result.success) {
        Alert.alert(
          "Error de autenticación biométrica",
          result.error || "No se pudo autenticar con biometría"
        );
      }
      // Si es exitoso, el contexto manejará la navegación
    } catch (error) {
      console.error('Biometric login error:', error);
      Alert.alert(
        "Error",
        "Error en autenticación biométrica"
      );
    }
  }

  function toggleSaveCredentials() {
    setSaveCredentials(!saveCredentials);
  }

  if (authCntx.isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.rootScreen}>
      <LinearGradient
        colors={[GlobalStyles.primary500, GlobalStyles.primary50, "#f1f1f1f1"]}
        style={[styles.rootScreen, styles.container]}
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>Bienvenido</Text>
          <Text style={styles.subtitle}>Ingresa los datos de tu cuenta</Text>
          
          <TextInput
            style={styles.textInput}
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChangeText={inputChangeHandler.bind(this, "email")}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          
          <TextInput
            style={styles.textInput}
            placeholder="Contraseña"
            secureTextEntry={true}
            value={formData.password}
            onChangeText={inputChangeHandler.bind(this, "password")}
            autoCapitalize="none"
          />

          {/* Opción para guardar credenciales */}
          {loginOptions.biometricSupported && (
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={toggleSaveCredentials}
            >
              <Ionicons
                name={saveCredentials ? "checkbox" : "checkbox-outline"}
                size={20}
                color={GlobalStyles.primary500}
              />
              <Text style={styles.checkboxText}>
                Guardar credenciales para acceso rápido
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {/* Botón de login biométrico */}
          {loginOptions.canUseBiometric && (
            <TouchableOpacity 
              style={styles.biometricButton}
              onPress={biometricLogin}
            >
              <Ionicons
                name="finger-print"
                size={30}
                color="white"
              />
              <Text style={styles.biometricText}>
                Acceder con biometría
              </Text>
            </TouchableOpacity>
          )}

          {/* Botón de login normal */}
          <ButtonCustom 
            title={"Iniciar sesión"} 
            onPress={loginConfirm}
            style={loginOptions.canUseBiometric ? styles.loginButton : null}
          />

          {/* Información sobre biometría */}
          {loginOptions.biometricSupported && !loginOptions.canUseBiometric && (
            <Text style={styles.biometricInfo}>
              Habilita la autenticación biométrica después del primer login
            </Text>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  rootScreen: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    maxWidth: 400,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 65,
    fontWeight: "bold",
    textAlign: "left",
    color: "#181818",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: "#302E2E",
    marginBottom: 30,
  },
  textInput: {
    borderWidth: 1,
    borderColor: GlobalStyles.primary100,
    paddingStart: 25,
    backgroundColor: "white",
    padding: 15,
    marginVertical: 10,
    borderRadius: 20,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#302E2E",
    flex: 1,
  },
  biometricButton: {
    backgroundColor: GlobalStyles.primary700,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  biometricText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  loginButton: {
    marginTop: 0,
  },
  biometricInfo: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 15,
    fontStyle: "italic",
  },
  link: {
    color: "gray",
    marginVertical: 10,
  },
});

