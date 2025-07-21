import { createContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { getUserProfile, getStoredUserId, getEvents } from "../util/http";

export const AuthContext = createContext({
    user: null,
    events: [],
    isLoading: true,
    isAuthenticated: false,
    isBiometricEnabled: false,
    login: (userData) => {},
    logout: () => {},
    loginWithBiometrics: () => {},
    setupBiometrics: (email, password) => {},
    enableBiometric: () => {},
    disableBiometric: () => {},
    checkSession: () => {},
    refreshEvents: () => {}
});

function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    // Verificar sesión existente al iniciar la app
    useEffect(() => {
        checkExistingSession();
        loadBiometricStatus();
    }, []);
    
    // Cargar estado biométrico
    const loadBiometricStatus = async () => {
        try {
            const biometricStatus = await AuthService.isBiometricEnabled();
            setIsBiometricEnabled(biometricStatus);
        } catch (error) {
            console.error('Error loading biometric status:', error);
            setIsBiometricEnabled(false);
        }
    };

    // Verificar si hay una sesión activa
    const checkExistingSession = async () => {
        try {
            setIsLoading(true);
            
            // Verificar si hay una sesión activa
            const hasSession = await AuthService.hasActiveSession();
            
            if (hasSession) {
                // Obtener datos del usuario
                const userProfile = await getUserProfile();
                
                if (userProfile) {
                    setUser(userProfile);
                    setIsAuthenticated(true);
                    
                    // Cargar eventos del usuario
                    await loadUserEvents(userProfile.id);
                } else {
                    // Si no se puede obtener el perfil, limpiar sesión
                    await AuthService.performLogout();
                    setUser(null);
                    setEvents([]);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setEvents([]);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Error checking existing session:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar eventos del usuario
    const loadUserEvents = async (userId) => {
        try {
            const userEvents = await getEvents(userId);
            setEvents(userEvents || []);
        } catch (error) {
            console.error('Error loading user events:', error);
            setEvents([]);
        }
    };

    // Login con credenciales
    const login = async (email, password, saveCredentials = false) => {
        try {
            setIsLoading(true);
            
            const result = await AuthService.loginWithCredentials(email, password, saveCredentials);
            
            if (result.success) {
                setUser(result.user);
                setIsAuthenticated(true);
                
                // Cargar eventos del usuario después del login
                await loadUserEvents(result.user.id);
                
                // Si el login fue exitoso y el usuario quiere guardar credenciales,
                // preguntar sobre biometría
                if (saveCredentials) {
                    setTimeout(() => {
                        AuthService.setupBiometricAuthentication(email, password);
                    }, 1000); // Dar tiempo para que se muestre la pantalla principal
                }
                
                return { success: true, user: result.user };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Login error in context:', error);
            return { success: false, error: 'Error de conexión' };
        } finally {
            setIsLoading(false);
        }
    };

    // Login con biometría
    const loginWithBiometrics = async () => {
        try {
            setIsLoading(true);
            
            const result = await AuthService.loginWithBiometrics();
            
            if (result.success) {
                setUser(result.user);
                setIsAuthenticated(true);
                
                // Cargar eventos del usuario después del login biométrico
                await loadUserEvents(result.user.id);
                
                return { success: true, user: result.user };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            console.error('Biometric login error in context:', error);
            return { success: false, error: 'Error en autenticación biométrica' };
        } finally {
            setIsLoading(false);
        }
    };

    // Configurar autenticación biométrica
    const setupBiometrics = async (email, password) => {
        try {
            const result = await AuthService.setupBiometricAuthentication(email, password);
            return result;
        } catch (error) {
            console.error('Setup biometrics error in context:', error);
            return false;
        }
    };

    // Logout
    const logout = async () => {
        try {
            setIsLoading(true);
            
            await AuthService.performLogout();
            setUser(null);
            setEvents([]);
            setIsAuthenticated(false);
            
            return { success: true };
        } catch (error) {
            console.error('Logout error in context:', error);
            // Incluso si hay error en el servidor, limpiar estado local
            setUser(null);
            setEvents([]);
            setIsAuthenticated(false);
            return { success: true };
        } finally {
            setIsLoading(false);
        }
    };

    // Verificar sesión (para uso manual)
    const checkSession = async () => {
        await checkExistingSession();
    };

    // Obtener opciones de login disponibles
    const getLoginOptions = async () => {
        try {
            return await AuthService.getAvailableLoginOptions();
        } catch (error) {
            console.error('Error getting login options:', error);
            return {
                biometricSupported: false,
                biometricEnabled: false,
                hasCredentials: false,
                canUseBiometric: false
            };
        }
    };

    // Recargar eventos manualmente
    const refreshEvents = async () => {
        if (user && user.id) {
            await loadUserEvents(user.id);
        }
    };
    
    // Habilitar biometría
    const enableBiometric = async () => {
        try {
            if (!user?.email) {
                throw new Error('No hay usuario activo');
            }
            
            // Usar las credenciales actuales (si están disponibles) o solicitar nueva autenticación
            const credentials = await AuthService.getSavedCredentials();
            let email, password;
            
            if (credentials) {
                email = credentials.email;
                password = credentials.password;
            } else {
                // Si no hay credenciales guardadas, necesitamos solicitarlas
                throw new Error('No hay credenciales disponibles para habilitar biometría');
            }
            
            const result = await AuthService.setupBiometricAuthentication(email, password);
            if (result) {
                setIsBiometricEnabled(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error enabling biometric:', error);
            return false;
        }
    };
    
    // Deshabilitar biometría
    const disableBiometric = async () => {
        try {
            const result = await AuthService.disableBiometric();
            if (result) {
                setIsBiometricEnabled(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error disabling biometric:', error);
            return false;
        }
    };

    const value = {
        user,
        events,
        isLoading,
        isAuthenticated,
        isBiometricEnabled,
        login,
        logout,
        loginWithBiometrics,
        setupBiometrics,
        enableBiometric,
        disableBiometric,
        checkSession,
        getLoginOptions,
        refreshEvents
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;