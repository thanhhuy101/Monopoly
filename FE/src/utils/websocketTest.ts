// Simple test to verify WebSocket room events
import { websocketService } from '../services/websocketService';

// Test function to connect to room events
export function testRoomConnection(roomId: string, userId: string) {
  
  // Listen for room updates
  websocketService.onRoomUpdate(() => {
  });
  
  // Join the room
  websocketService.joinRoom(roomId, userId);
  
  // Cleanup after 10 seconds
  setTimeout(() => {
    websocketService.leaveRoom(roomId);
  }, 10000);
}
