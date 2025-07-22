import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { login, logout, getUserProfile, isAuthenticated } from '../util/http';

const BIOMETRIC_STORAGE_KEY = 'biometric_enabled';
const USER_CREDENTIALS_KEY = 'user_credentials';

class AuthService {
  constructor() {
    this.isBiometricAvailable = false;
    this.biometricType = null;
    this._initPromise = null;
  }

  // Inicializar verificación de biometría disponible
  async initializeBiometrics() {
    if (!this._initPromise) {
      this._initPromise = this._performBiometricInit();
    }
    return this._initPromise;
  }

  async _performBiometricInit() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      this.isBiometricAvailable = hasHardware && isEnrolled;
      this.biometricType = supportedTypes;
      

      return {
        available: this.isBiometricAvailable,
        types: this.biometricType
      };
    } catch (error) {
      this.isBiometricAvailable = false;
      this.biometricType = null;
      return {
        available: false,
        types: null,
        error: error.message
      };
    }
  }

  // Verificar si la biometría está disponible en el dispositivo
  async isBiometricSupported() {
    await this.initializeBiometrics();
    return this.isBiometricAvailable;
  }

  // Verificar si el usuario tiene la biometría habilitada
  async isBiometricEnabled() {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_STORAGE_KEY);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  // Habilitar/deshabilitar autenticación biométrica
  async setBiometricEnabled(enabled) {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_STORAGE_KEY, enabled.toString());
      return true;
    } catch (error) {
      return false;
    }
  }

  // Autenticar con biometría
  async authenticateWithBiometrics() {
    try {
      if (!this.isBiometricAvailable) {
        throw new Error('Biometric authentication not available');
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentica para acceder a tu cuenta',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      });

      return result.success;
    } catch (error) {
      return false;
    }
  }

  // Guardar credenciales de forma segura (solo si el usuario lo permite)
  async saveCredentials(email, password) {
    try {
      const credentials = JSON.stringify({ email, password });
      await SecureStore.setItemAsync(USER_CREDENTIALS_KEY, credentials);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtener credenciales guardadas
  async getSavedCredentials() {
    try {
      const credentials = await SecureStore.getItemAsync(USER_CREDENTIALS_KEY);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      return null;
    }
  }

  // Eliminar credenciales guardadas
  async removeSavedCredentials() {
    try {
      await SecureStore.deleteItemAsync(USER_CREDENTIALS_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Login con credenciales
  async loginWithCredentials(email, password, saveCredentials = false) {
    try {
      const result = await login({ email, password });
      
      if (result && result.user) {
        // Guardar credenciales si el usuario lo solicita
        if (saveCredentials) {
          await this.saveCredentials(email, password);
        }
        
        return {
          success: true,
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        };
      } else {
        return {
          success: false,
          error: 'Credenciales inválidas'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Error de conexión. Intenta nuevamente.'
      };
    }
  }

  // Login con biometría (usa credenciales guardadas)
  async loginWithBiometrics() {
    try {
      // Verificar si la biometría está habilitada
      const biometricEnabled = await this.isBiometricEnabled();
      if (!biometricEnabled) {
        throw new Error('Biometric authentication not enabled');
      }

      // Autenticar con biometría
      const biometricSuccess = await this.authenticateWithBiometrics();
      if (!biometricSuccess) {
        return {
          success: false,
          error: 'Autenticación biométrica fallida'
        };
      }

      // Obtener credenciales guardadas
      const credentials = await this.getSavedCredentials();
      if (!credentials) {
        return {
          success: false,
          error: 'No hay credenciales guardadas'
        };
      }

      // Hacer login con credenciales guardadas
      return await this.loginWithCredentials(credentials.email, credentials.password);
    } catch (error) {
      return {
        success: false,
        error: 'Error en autenticación biométrica'
      };
    }
  }

  // Configurar autenticación biométrica
  async setupBiometricAuthentication(email, password) {
    try {
      // Verificar si la biometría está disponible
      const supported = await this.isBiometricSupported();
      if (!supported) {
        Alert.alert(
          'Biometría no disponible',
          'Tu dispositivo no soporta autenticación biométrica o no tienes configurada ninguna.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Mostrar diálogo para confirmar
      return new Promise((resolve) => {
        Alert.alert(
          'Habilitar Autenticación Biométrica',
          '¿Deseas habilitar la autenticación biométrica para futuros inicios de sesión?',
          [
            {
              text: 'No',
              style: 'cancel',
              onPress: () => resolve(false)
            },
            {
              text: 'Sí',
              onPress: async () => {
                try {
                  // Autenticar una vez para confirmar
                  const authSuccess = await this.authenticateWithBiometrics();
                  if (authSuccess) {
                    // Guardar credenciales y habilitar biometría
                    await this.saveCredentials(email, password);
                    await this.setBiometricEnabled(true);
                    
                    Alert.alert(
                      'Éxito',
                      'Autenticación biométrica habilitada correctamente',
                      [{ text: 'OK' }]
                    );
                    resolve(true);
                  } else {
                    Alert.alert(
                      'Error',
                      'No se pudo configurar la autenticación biométrica',
                      [{ text: 'OK' }]
                    );
                    resolve(false);
                  }
                } catch (error) {
                  resolve(false);
                }
              }
            }
          ]
        );
      });
    } catch (error) {
      return false;
    }
  }

  // Logout completo
  async performLogout() {
    try {
      await logout();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Verificar si hay una sesión activa
  async hasActiveSession() {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        // Verificar si el token aún es válido obteniendo el perfil
        const profile = await getUserProfile();
        return !!profile;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  // Deshabilitar autenticación biométrica
  async disableBiometric() {
    try {
      await this.setBiometricEnabled(false);
      // Opcionalmente también eliminar credenciales guardadas
      // await this.removeSavedCredentials();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obtener información del tipo de biometría disponible
  getBiometricTypeText() {
    if (!this.biometricType || this.biometricType.length === 0) {
      return 'Ninguna';
    }

    const types = this.biometricType.map(type => {
      switch (type) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT:
          return 'Huella dactilar';
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
          return 'Reconocimiento facial';
        case LocalAuthentication.AuthenticationType.IRIS:
          return 'Reconocimiento de iris';
        default:
          return 'Biométrica';
      }
    });

    return types.join(', ');
  }

  // Mostrar opciones de login disponibles
  async getAvailableLoginOptions() {
    const biometricSupported = await this.isBiometricSupported();
    const biometricEnabled = await this.isBiometricEnabled();
    const hasCredentials = !!(await this.getSavedCredentials());

    return {
      biometricSupported,
      biometricEnabled,
      hasCredentials,
      canUseBiometric: biometricSupported && biometricEnabled && hasCredentials
    };
  }
}

// Exportar instancia singleton
export default new AuthService();