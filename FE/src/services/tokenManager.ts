// Token management utilities for automatic refresh and validation
import { authApi } from './authApi';
import { useAuthStore } from '../store/authStore';

// Token refresh buffer (5 minutes before expiry)
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

let refreshTimer: any = null;
let isRefreshing = false;

export interface TokenPayload {
  uid: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
}

// Parse JWT token without verification (for expiry checking)
function parseJWT(token: string): TokenPayload | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Check if token is expired or will expire soon
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload) return true;

  const now = Date.now() / 1000;
  return payload.exp - now < (TOKEN_EXPIRY_BUFFER / 1000);
}

// Get token expiry time in milliseconds
export function getTokenExpiryTime(token: string): number {
  const payload = parseJWT(token);
  if (!payload) return 0;
  return payload.exp * 1000;
}

// Clear refresh timer
function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

// Setup automatic token refresh
export function setupTokenRefresh(token: string) {
  clearRefreshTimer();

  const expiryTime = getTokenExpiryTime(token);
  const now = Date.now();
  const timeUntilExpiry = expiryTime - now;

  if (timeUntilExpiry <= TOKEN_EXPIRY_BUFFER) {
    // Token expires soon, refresh immediately
    refreshToken();
    return;
  }

  // Schedule refresh before expiry
  const refreshDelay = timeUntilExpiry - TOKEN_EXPIRY_BUFFER;
  
  refreshTimer = setTimeout(() => {
    refreshToken();
  }, refreshDelay);
}

// Refresh token
async function refreshToken(): Promise<boolean> {
  if (isRefreshing) return false;
  
  isRefreshing = true;
  
  try {
    const refreshTokenValue = localStorage.getItem('refresh_token');
    if (!refreshTokenValue) throw new Error('No refresh token available');

    const response = await authApi.refreshToken(refreshTokenValue);
    const newToken = response.accessToken;
    
    // Update token in localStorage
    localStorage.setItem('access_token', newToken);
    
    // Update auth store
    const authStore = useAuthStore.getState();
    authStore.accessToken = newToken;
    
    // Setup next refresh
    setupTokenRefresh(newToken);
    
    return true;
  } catch (error) {
    // Token refresh failed
    
    // Refresh failed, logout user
    const authStore = useAuthStore.getState();
    await authStore.logout();
    
    return false;
  } finally {
    isRefreshing = false;
  }
}

// Initialize token management on app start
export function initializeTokenManagement() {
  const token = localStorage.getItem('access_token');
  
  if (token && !isTokenExpired(token)) {
    setupTokenRefresh(token);
  } else if (token && isTokenExpired(token)) {
    // Token expired, try to refresh
    refreshToken();
  }
}

// Cleanup token management
export function cleanupTokenManagement() {
  clearRefreshTimer();
}

// Export for testing purposes
export { clearRefreshTimer, refreshToken, parseJWT };
