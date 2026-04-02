import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

export interface WebSocketService {
  socket: Socket | null;
  roomSocket: Socket | null;
  connect: (token: string, userId: string) => void;
  disconnect: () => void;
  joinUserRoom: (userId: string) => void;
  onUserStatusChange: (callback: (data: { userId: string; isOnline: boolean; lastSeen?: string }) => void) => void;
  offUserStatusChange: (callback: (data: { userId: string; isOnline: boolean; lastSeen?: string }) => void) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: (roomId: string) => void;
  onRoomUpdate: (callback: (event: string, data: any) => void) => void;
  offRoomUpdate: (callback: (event: string, data: any) => void) => void;
}

class WebSocketServiceImpl implements WebSocketService {
  public socket: Socket | null = null;
  public roomSocket: Socket | null = null;
  private statusChangeCallbacks: Set<(data: { userId: string; isOnline: boolean; lastSeen?: string }) => void> = new Set();
  private roomUpdateCallbacks: Set<(event: string, data: any) => void> = new Set();
  private cleanup: (() => void) | null = null;

  connect(token: string, userId: string) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(`${WS_URL}/user-status`, {
      auth: {
        token
      },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      this.joinUserRoom(userId);
    });

    this.socket.on('disconnect', () => {
    });

    this.socket.on('user:status-change', (data: { userId: string; isOnline: boolean; lastSeen?: string }) => {
      this.statusChangeCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('connect_error', () => {
    });

    // Handle browser close/tab close
    const handleBeforeUnload = () => {
      if (this.socket?.connected) {
        this.socket.emit('user:status', { userId, isOnline: false });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Store cleanup function
    this.cleanup = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    if (this.roomSocket) {
      this.roomSocket.disconnect();
      this.roomSocket = null;
    }
    this.statusChangeCallbacks.clear();
    this.roomUpdateCallbacks.clear();
    
    // Clean up event listeners
    if (this.cleanup) {
      this.cleanup();
      this.cleanup = null;
    }
  }

  joinUserRoom(userId: string) {
    if (this.socket?.connected) {
      this.socket.emit('user:join', { userId });
    }
  }

  onUserStatusChange(callback: (data: { userId: string; isOnline: boolean; lastSeen?: string }) => void) {
    this.statusChangeCallbacks.add(callback);
  }

  offUserStatusChange(callback: (data: { userId: string; isOnline: boolean; lastSeen?: string }) => void) {
    this.statusChangeCallbacks.delete(callback);
  }

  joinRoom(roomId: string, userId: string) {
    if (!this.roomSocket?.connected) {
      // Connect to room-events namespace if not connected
      const token = localStorage.getItem('access_token');
      if (token) {
        this.roomSocket = io(`${WS_URL}/room-events`, {
          auth: { token },
          transports: ['websocket']
        });

        this.roomSocket.on('connect', () => {
          // Join the room after connecting
          this.roomSocket?.emit('room:join', { roomId, userId });
        });

        this.roomSocket.on('disconnect', () => {
        });

        this.roomSocket.on('room:player-joined', (data) => {
          this.roomUpdateCallbacks.forEach(callback => callback('room:player-joined', data));
        });

        this.roomSocket.on('room:player-left', (data) => {
          this.roomUpdateCallbacks.forEach(callback => callback('room:player-left', data));
        });

        this.roomSocket.on('room:deleted', (data) => {
          this.roomUpdateCallbacks.forEach(callback => callback('room:deleted', data));
        });

        this.roomSocket.on('connect_error', () => {
        });
      }
    } else {
      // Already connected, just join the room
      this.roomSocket.emit('room:join', { roomId, userId });
    }
  }

  leaveRoom(roomId: string) {
    if (this.roomSocket?.connected) {
      this.roomSocket.emit('room:leave', { roomId });
    }
  }

  onRoomUpdate(callback: (event: string, data: any) => void) {
    this.roomUpdateCallbacks.add(callback);
  }

  offRoomUpdate(callback: (event: string, data: any) => void) {
    this.roomUpdateCallbacks.delete(callback);
  }
}

export const websocketService = new WebSocketServiceImpl();
