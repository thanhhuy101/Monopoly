import { AuthUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to create headers with cache control
function createHeaders(token?: string, additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...additionalHeaders,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// User API functions
export const userApi = {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthUser> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: createHeaders(token),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch profile: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Update user profile
   */
  async updateProfile(data: {
    displayName?: string;
    emoji?: string;
    avatarUrl?: string;
  }): Promise<AuthUser> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: createHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Get public user info
   */
  async getPublicUserInfo(userId: string): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Get user statistics
   */
  async getUserStats(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/stats`, {
      method: 'GET',
      headers: createHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user stats: ${response.statusText}`);
    }

    return await response.json();
  },

  /**
   * Update online status
   */
  async updateOnlineStatus(isOnline: boolean): Promise<any> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${API_BASE_URL}/users/online-status`, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify({ isOnline }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update online status: ${response.statusText}`);
    }

    return await response.json();
  },
};
