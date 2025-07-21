import axios from "axios";
import * as SecureStore from 'expo-secure-store';

const BACKEND_URL = "https://sanfer-backend-production.up.railway.app/api";

// Crear instancia de axios con interceptors
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar refresh token automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${BACKEND_URL}/event-user/refresh`, {
            refreshToken: refreshToken
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Guardar nuevos tokens
          await SecureStore.setItemAsync('accessToken', accessToken);
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
          
          // Reintentar petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens y redirigir a login
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userId');
        // Aquí podrías emitir un evento para que la app navegue al login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ===== AUTENTICACIÓN =====
export async function login(userData) {
  try {
    const response = await axios.post(`${BACKEND_URL}/event-user/login`, userData);
    const { user, accessToken, refreshToken } = response.data;
    
    // Guardar tokens y userId de forma segura
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', refreshToken);
    await SecureStore.setItemAsync('userId', user.id);
    
    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function logout() {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (refreshToken) {
      await axios.post(`${BACKEND_URL}/event-user/logout`, { refreshToken });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Limpiar tokens locales siempre
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    await SecureStore.deleteItemAsync('userId');
  }
}

export async function getUserProfile() {
  try {
    const response = await apiClient.get('/event-user/profile');
    return response.data.user;
  } catch (error) {
    console.error('Get user profile error:', error);
    return null;
  }
}

export async function refreshTokens() {
  try {
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (!refreshToken) return null;
    
    const response = await axios.post(`${BACKEND_URL}/event-user/refresh`, {
      refreshToken: refreshToken
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    await SecureStore.setItemAsync('accessToken', accessToken);
    await SecureStore.setItemAsync('refreshToken', newRefreshToken);
    
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('Refresh token error:', error);
    return null;
  }
}

// ===== EVENTOS =====
export async function getEvents(userId) {
  try {
    const response = await apiClient.get(`/event/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get events error:', error);
    return [];
  }
}

// ===== PONENTES =====
export async function getSpeakers(eventId) {
  try {
    const response = await apiClient.get(`/speaker/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Get speakers error:', error);
    return [];
  }
}

// ===== ASIGNACIONES DE USUARIO =====
export async function getUserAssignments(eventId, userId) {
  try {
    const response = await apiClient.get(`/event/${eventId}/assignments/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user assignments error:', error);
    return null;
  }
}

// ===== AGENDA =====
export async function getAgenda(eventId, groupId) {
  try {
    const response = await apiClient.get(`/event-agenda/${eventId}/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Get agenda error:', error);
    return {};
  }
}

export async function getAgendaByEvent(eventId) {
  try {
    const response = await apiClient.get(`/event-agenda/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Get agenda by event error:', error);
    return [];
  }
}

// ===== HOTELES =====
export async function getHotel(eventId) {
  try {
    const response = await apiClient.get(`/hotel/event/${eventId}`);
    return response.data[0] || null;
  } catch (error) {
    console.error('Get hotel error:', error);
    return null;
  }
}

// ===== TRANSPORTES =====
export async function getTransports(eventId) {
  try {
    const response = await apiClient.get(`/event-transport/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Get transports error:', error);
    return [];
  }
}

export async function getTransportsByGroup(groupId) {
  try {
    const response = await apiClient.get(`/event-transport/group/${groupId}`);
    return response.data;
  } catch (error) {
    console.error('Get transports by group error:', error);
    return [];
  }
}

// ===== MENÚ DE APP =====
export async function getAppMenu(eventId) {
  try {
    const response = await apiClient.get(`/app-menu/event/${eventId}`);
    return response.data.appMenu;
  } catch (error) {
    console.error('Get app menu error:', error);
    return null;
  }
}

// ===== ENCUESTAS =====
export async function getSurveys(eventId) {
  try {
    const response = await apiClient.get(`/survey/event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Get surveys error:', error);
    return [];
  }
}

export async function getSurveyWithQuestions(surveyId) {
  try {
    const response = await apiClient.get(`/survey/${surveyId}/with-questions`);
    return response.data;
  } catch (error) {
    console.error('Get survey with questions error:', error);
    return null;
  }
}

export async function submitSurveyResponse(surveyId, userId, answers) {
  try {
    const response = await apiClient.post('/survey-response/submit', {
      surveyId,
      userId,
      answers
    });
    return response.data;
  } catch (error) {
    console.error('Submit survey response error:', error);
    return null;
  }
}

export async function checkSurveyCompleted(surveyId, userId) {
  try {
    const response = await apiClient.get(`/survey-response/check/${surveyId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Check survey completed error:', error);
    return false;
  }
}

// ===== FUNCIONES DE UTILIDAD =====
export async function isAuthenticated() {
  const token = await SecureStore.getItemAsync('accessToken');
  return !!token;
}

export async function getStoredUserId() {
  return await SecureStore.getItemAsync('userId');
}
