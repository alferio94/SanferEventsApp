import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BACKEND_URL = "https://sanfer-backend-production.up.railway.app/api";
// const BACKEND_URL = "http://192.168.1.66:3000/api";

// Crear instancia de axios con interceptors
const apiClient = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Continue without token if SecureStore fails
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar refresh token automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
        if (refreshToken) {
          const response = await axios.post(
            `${BACKEND_URL}/event-user/refresh`,
            {
              refreshToken: refreshToken,
            },
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          // Guardar nuevos tokens
          await SecureStore.setItemAsync("accessToken", accessToken);
          await SecureStore.setItemAsync("refreshToken", newRefreshToken);

          // Reintentar petición original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si falla el refresh, limpiar tokens de forma segura
        try {
          await SecureStore.deleteItemAsync("accessToken");
          await SecureStore.deleteItemAsync("refreshToken");
          await SecureStore.deleteItemAsync("userId");
        } catch (deleteError) {
          // Error cleaning tokens - continue silently
        }
        // Aquí podrías emitir un evento para que la app navegue al login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// ===== AUTENTICACIÓN =====
export async function login(userData) {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/event-user/login`,
      userData,
    );
    const { user, accessToken, refreshToken } = response.data;

    // Guardar tokens y userId de forma segura
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    await SecureStore.setItemAsync("userId", user.id);

    return { user, accessToken, refreshToken };
  } catch (error) {
    return null;
  }
}

export async function logout() {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (refreshToken) {
      await axios.post(`${BACKEND_URL}/event-user/logout`, { refreshToken });
    }
  } catch (error) {
  } finally {
    // Limpiar tokens locales siempre
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userId");
  }
}

export async function getUserProfile() {
  try {
    const response = await apiClient.get("/event-user/profile");
    return response.data.user;
  } catch (error) {
    return null;
  }
}

export async function refreshTokens() {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) return null;

    const response = await axios.post(`${BACKEND_URL}/event-user/refresh`, {
      refreshToken: refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", newRefreshToken);

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    return null;
  }
}

// ===== EVENTOS =====
export async function getEvents(userId) {
  try {
    const response = await apiClient.get(`/event/user/${userId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

// ===== PONENTES =====
export async function getSpeakers(eventId) {
  try {
    const response = await apiClient.get(`/speaker/event/${eventId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

// ===== ASIGNACIONES DE USUARIO =====
export async function getUserAssignments(eventId, userId) {
  try {
    const response = await apiClient.get(
      `/event/${eventId}/assignments/${userId}`,
    );
    return response.data;
  } catch (error) {
    return null;
  }
}

// ===== AGENDA =====
export async function getAgenda(eventId, groupId) {
  try {
    const response = await apiClient.get(
      `/event-agenda/${eventId}/group/${groupId}`,
    );
    return response.data;
  } catch (error) {
    return {};
  }
}

export async function getAgendaByEvent(eventId) {
  try {
    const response = await apiClient.get(`/event-agenda/${eventId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

// ===== HOTELES =====
export async function getHotel(eventId) {
  try {
    const response = await apiClient.get(`/hotel/event/${eventId}`);
    return response.data[0] || null;
  } catch (error) {
    return null;
  }
}

// ===== TRANSPORTES =====
export async function getTransports(eventId) {
  try {
    const response = await apiClient.get(`/event-transport/event/${eventId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getTransportsByGroup(groupId) {
  try {
    const response = await apiClient.get(`/event-transport/group/${groupId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

// ===== MENÚ DE APP =====
export async function getAppMenu(eventId) {
  try {
    const response = await apiClient.get(`/app-menu/event/${eventId}`);
    return response.data.appMenu;
  } catch (error) {
    return null;
  }
}

// ===== ENCUESTAS =====
export async function getSurveys(eventId) {
  try {
    const response = await apiClient.get(`/survey/event/${eventId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getSurveysByGroup(groupId) {
  try {
    const response = await apiClient.get(`/survey/group/${groupId}`);
    return response.data;
  } catch (error) {
    return [];
  }
}

export async function getSurveyWithQuestions(surveyId) {
  try {
    const response = await apiClient.get(`/survey/${surveyId}/with-questions`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function submitSurveyResponse(surveyId, userId, answers) {
  try {
    const response = await apiClient.post("/survey-response/submit", {
      surveyId,
      userId,
      answers,
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function checkSurveyCompleted(surveyId, userId) {
  try {
    const response = await apiClient.get(
      `/survey-response/check/${surveyId}/${userId}`,
    );
    return response.data;
  } catch (error) {
    return false;
  }
}

// ===== FUNCIONES DE UTILIDAD =====
export async function isAuthenticated() {
  try {
    const token = await SecureStore.getItemAsync("accessToken");
    return !!token;
  } catch (error) {
    return false;
  }
}

export async function getStoredUserId() {
  try {
    return await SecureStore.getItemAsync("userId");
  } catch (error) {
    return null;
  }
}
