import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "ADMIN" | "BASIC" | "PREMIUM";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  getRefreshToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setTokens: (accessToken, refreshToken) => {
        if (accessToken) {
          localStorage.setItem("access_token", accessToken);
        } else {
          localStorage.removeItem("access_token");
        }
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        } else {
          localStorage.removeItem("refresh_token");
        }
        set({ token: accessToken, refreshToken });
      },

      login: (user, accessToken, refreshToken) => {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        set({ 
          user, 
          token: accessToken, 
          refreshToken,
          isAuthenticated: true, 
          isLoading: false 
        });
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ 
          user: null, 
          token: null, 
          refreshToken: null,
          isAuthenticated: false 
        });
      },

      setLoading: (isLoading) => set({ isLoading }),

      getRefreshToken: () => {
        const state = get();
        return state.refreshToken || localStorage.getItem("refresh_token");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
