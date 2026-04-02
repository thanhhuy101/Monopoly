import { create } from 'zustand';
import { stopTheme } from '../utils/musicManager';
import { authApi, ApiError } from '../services/authApi';
import { AuthUser } from '../types';
import { useOnlineStatusStore } from './onlineStatusStore';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
  clearError: () => void;
}

// Import types from centralized types file
type RegisterRequest = {
  email: string;
  password: string;
  username: string;
  displayName: string;
  emoji: string;
};


function loadUser(): { user: AuthUser | null; accessToken: string | null; refreshToken: string | null } {
  try {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userRaw = localStorage.getItem('auth_user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { user, accessToken, refreshToken };
  } catch {
    return { user: null, accessToken: null, refreshToken: null };
  }
}

function saveAuth(user: AuthUser, accessToken: string, refreshToken?: string) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('auth_user', JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
}

function clearAuth() {
  localStorage.clear();
  sessionStorage.clear();
}

export const useAuthStore = create<AuthState>((set, get) => {
  const { user: initialUser, accessToken: initialAccessToken, refreshToken: initialRefreshToken } = loadUser();
  
  // Initialize WebSocket if user is already authenticated
  if (initialUser && initialAccessToken) {
    setTimeout(() => {
      useOnlineStatusStore.getState().initializeWebSocket(initialAccessToken, initialUser.id);
    }, 100);
  }
  
  return {
    user: initialUser,
    accessToken: initialAccessToken,
    refreshToken: initialRefreshToken,
    isLoading: false,
    error: null,
    isAuthenticated: !!initialUser && !!initialAccessToken,

    async login(email: string, password: string) {
      set({ isLoading: true, error: null });
      try {
        const response = await authApi.login({ email, password });
        saveAuth(response.user, response.tokens.accessToken, response.tokens.refreshToken);
        set({ 
          user: response.user, 
          accessToken: response.tokens.accessToken, 
          refreshToken: response.tokens.refreshToken || null,
          isAuthenticated: true,
          isLoading: false 
        });
        
        // Initialize WebSocket connection for online status
        useOnlineStatusStore.getState().initializeWebSocket(
          response.tokens.accessToken,
          response.user.id
        );
      } catch (error) {
        const message = error instanceof ApiError ? error.message : 'Login failed';
        set({ 
          error: message, 
          isLoading: false,
          isAuthenticated: false 
        });
        throw error;
      }
    },

    async register(userData: { email: string; password: string; username: string; displayName: string; emoji: string }) {
      set({ isLoading: true, error: null });
      try {
        await authApi.register(userData);
        // Don't save tokens after registration - user must login manually
        set({ 
          isLoading: false 
        });
      } catch (error) {
        const message = error instanceof ApiError ? error.message : 'Registration failed';
        set({ 
          error: message, 
          isLoading: false,
          isAuthenticated: false 
        });
        throw error;
      }
    },

    async logout() {
      set({ isLoading: true });
      try {
        // Disconnect WebSocket before logout
        useOnlineStatusStore.getState().disconnectWebSocket();
        
        if (get().accessToken) {
          await authApi.logout();
        }
      } catch (error) {
        // Logout error
      } finally {
        stopTheme();
        clearAuth();
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null,
          isAuthenticated: false, 
          isLoading: false,
          error: null 
        });
      }
    },

    async refreshAuth() {
      const { refreshToken } = get();
      if (!refreshToken) return;

      try {
        const response = await authApi.refreshToken(refreshToken);
        localStorage.setItem('access_token', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refresh_token', response.refreshToken);
        }
        set({ 
          accessToken: response.accessToken,
          refreshToken: response.refreshToken || refreshToken
        });
      } catch (error) {
        // Token refresh failed, clear auth
        clearAuth();
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null,
          isAuthenticated: false,
          error: 'Session expired. Please login again.' 
        });
      }
    },


    updateUser(userData: Partial<AuthUser>) {
      set(state => ({
        ...state,
        user: state.user ? { ...state.user, ...userData } : null
      }));
    },

    clearError() {
      set({ error: null });
    },
  };
});
