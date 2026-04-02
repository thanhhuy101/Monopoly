import axios from 'axios';
import {
  GameRoom,
  CreateRoomDto,
  UpdateRoomDto,
  JoinRoomDto,
  RoomResponse,
  RoomDetailsResponse,
  PaginationParams,
  PaginationResponse,
} from '../types/room.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API errors
const handleApiError = (error: any): never => {
  if (error.response) {
    throw new Error(error.response.data.message || error.response.data.error || 'API Error');
  } else if (error.request) {
    throw new Error('Network error - please check your connection');
  } else {
    throw new Error(error.message || 'Unknown error occurred');
  }
};

export const roomApi = {
  // Create a new room
  async createRoom(roomData: CreateRoomDto): Promise<RoomResponse> {
    try {
      const response = await apiClient.post('/rooms', roomData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get list of rooms
  async getRooms(
    isPrivate?: boolean, 
    search?: string, 
    pagination?: PaginationParams
  ): Promise<PaginationResponse<GameRoom>> {
    try {
      const params: any = {};
      if (isPrivate !== undefined) params.isPrivate = isPrivate;
      if (search && search.trim()) params.search = search.trim();
      if (pagination?.page) params.page = pagination.page;
      if (pagination?.limit) params.limit = pagination.limit;
      
      const response = await apiClient.get('/rooms', { params });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get current user's rooms
  async getMyRooms(): Promise<GameRoom[]> {
    try {
      const response = await apiClient.get('/rooms/my-rooms');
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Get room details
  async getRoomDetails(roomId: string): Promise<RoomDetailsResponse> {
    try {
      const response = await apiClient.get(`/rooms/${roomId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Update room settings
  async updateRoom(roomId: string, updateData: UpdateRoomDto): Promise<RoomDetailsResponse> {
    try {
      const response = await apiClient.patch(`/rooms/${roomId}`, updateData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Delete room
  async deleteRoom(roomId: string): Promise<void> {
    try {
      await apiClient.delete(`/rooms/${roomId}`);
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Join a room
  async joinRoom(roomId: string, joinData?: JoinRoomDto): Promise<RoomDetailsResponse> {
    try {
      const response = await apiClient.post(`/rooms/${roomId}/join`, joinData || {});
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  // Leave a room
  async leaveRoom(roomId: string): Promise<void> {
    try {
      await apiClient.post(`/rooms/${roomId}/leave`);
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default roomApi;
