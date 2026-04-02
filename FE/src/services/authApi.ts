// API service for authentication endpoints
import {
  AuthResponse,
  AuthTokens,
  RegisterRequest,
  LoginRequest,
  RefreshTokenDto,
  IJwtPayload,
} from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api';

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode?: number,
    public error?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class AuthApiService {
  private getHeaders(includeAuth: boolean = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    if (includeAuth) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || 'Request failed',
          response.status,
          data.error
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error occurred');
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Logout user
  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: this.getHeaders(true),
    });
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken } as RefreshTokenDto),
    });
  }

  // Verify token
  async verifyToken(): Promise<IJwtPayload> {
    return this.request<IJwtPayload>('/auth/verify', {
      method: 'GET',
      headers: this.getHeaders(true),
    });
  }




  // Check if token is valid and not expired
  async isTokenValid(): Promise<boolean> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return false;

      await this.verifyToken();
      return true;
    } catch {
      return false;
    }
  }
}

export const authApi = new AuthApiService();
export default authApi;
