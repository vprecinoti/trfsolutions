import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros e fazer refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se não for erro 401 ou já tentou retry, rejeita
    if (error.response?.status !== 401 || originalRequest._retry) {
      // Se for 401 após retry, faz logout
      if (error.response?.status === 401 && originalRequest._retry) {
        if (typeof window !== "undefined") {
          useAuthStore.getState().logout();
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }

    // Não tentar refresh para rotas de auth
    if (originalRequest.url?.includes("/auth/login") || 
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Se já está fazendo refresh, adiciona na fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err: Error) => {
            reject(err);
          },
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = localStorage.getItem("refresh_token");
      
      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      // Chamar endpoint de refresh
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken, user } = response.data;

      // Atualizar tokens no store e localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", newRefreshToken);
      useAuthStore.getState().login(user, access_token, newRefreshToken);

      // Processar fila de requisições que falharam
      processQueue(null, access_token);

      // Refazer a requisição original com novo token
      originalRequest.headers.Authorization = `Bearer ${access_token}`;
      return api(originalRequest);

    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      
      // Refresh falhou, fazer logout
      if (typeof window !== "undefined") {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// Função helper para logout com chamada ao backend
export const logoutWithApi = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      await api.post("/auth/logout", { refresh_token: refreshToken });
    }
  } catch (error) {
    // Ignora erro no logout
    console.error("Erro ao fazer logout no servidor:", error);
  } finally {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

// Função para logout de todos os dispositivos
export const logoutAllDevices = async () => {
  try {
    await api.post("/auth/logout-all");
  } catch (error) {
    console.error("Erro ao fazer logout de todos dispositivos:", error);
  } finally {
    useAuthStore.getState().logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};
