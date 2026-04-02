import { create } from 'zustand';
import { websocketService } from '../services/websocketService';

interface OnlineUser {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface OnlineStatusState {
  onlineUsers: Map<string, OnlineUser>;
  currentUserOnline: boolean;
  initializeWebSocket: (token: string, userId: string) => void;
  disconnectWebSocket: () => void;
  setUserOnlineStatus: (userId: string, isOnline: boolean, lastSeen?: string) => void;
  isUserOnline: (userId: string) => boolean;
  getCurrentUserStatus: () => boolean;
}

export const useOnlineStatusStore = create<OnlineStatusState>((set, get) => ({
  onlineUsers: new Map(),
  currentUserOnline: false,

  initializeWebSocket: (token: string, userId: string) => {
    // Connect to WebSocket
    websocketService.connect(token, userId);
    
    // Listen for status changes
    const handleStatusChange = (data: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      const { onlineUsers } = get();
      const updatedUsers = new Map(onlineUsers);
      
      if (data.isOnline) {
        updatedUsers.set(data.userId, { userId: data.userId, isOnline: true });
      } else {
        updatedUsers.set(data.userId, { 
          userId: data.userId, 
          isOnline: false, 
          lastSeen: data.lastSeen 
        });
      }
      
      // Update current user status
      if (data.userId === userId) {
        set({ currentUserOnline: data.isOnline });
      }
      
      set({ onlineUsers: updatedUsers });
    };

    websocketService.onUserStatusChange(handleStatusChange);
    
    // Set current user as online initially
    set({ 
      currentUserOnline: true,
      onlineUsers: new Map([[userId, { userId, isOnline: true }]])
    });
  },

  disconnectWebSocket: () => {
    websocketService.disconnect();
    set({ 
      onlineUsers: new Map(),
      currentUserOnline: false 
    });
  },

  setUserOnlineStatus: (userId: string, isOnline: boolean, lastSeen?: string) => {
    const { onlineUsers } = get();
    const updatedUsers = new Map(onlineUsers);
    
    if (isOnline) {
      updatedUsers.set(userId, { userId, isOnline: true });
    } else {
      updatedUsers.set(userId, { 
        userId, 
        isOnline: false, 
        lastSeen 
      });
    }
    
    set({ onlineUsers: updatedUsers });
  },

  isUserOnline: (userId: string) => {
    const { onlineUsers } = get();
    const user = onlineUsers.get(userId);
    return user?.isOnline || false;
  },

  getCurrentUserStatus: () => {
    return get().currentUserOnline;
  },
}));
