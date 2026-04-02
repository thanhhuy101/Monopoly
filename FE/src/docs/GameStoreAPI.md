# Game Store API Integration

This document explains how the game store has been updated to integrate with the backend API.

## Overview

The Monopoly game now supports two modes:
1. **Local Mode** - Uses the original `gameStore.ts` for offline gameplay
2. **Online Mode** - Uses the enhanced `apiGameStore.ts` for backend-integrated gameplay

## Store Architecture

### Local Game Store (`gameStore.ts`)
- Handles all game logic locally
- No network calls
- Suitable for single-player or testing

### API Game Store (`apiGameStore.ts`)
- Extends the local game store with API integration
- Automatically switches between online and offline modes
- Provides fallback to local logic if API calls fail
- Handles state synchronization with backend

## Key Features

### 1. Automatic Mode Switching
```typescript
// The store automatically detects online status
const { isOnline } = useApiGameStore();

// Game actions automatically use API when online
gameStore.roll(); // Uses API if online, local if offline
```

### 2. Backend API Integration

#### Core Game Actions
- `rollDiceOnline()` - Roll dice via backend
- `buyPropertyOnline()` - Buy property via backend  
- `buildHouseOnline()` - Build houses via backend
- `mortgagePropertyOnline()` - Mortgage property via backend
- `tradeOnline()` - Trade properties via backend
- `endTurnOnline()` - End turn via backend

#### Game Management
- `startOnlineGame(roomId)` - Start a new online game
- `syncWithBackend()` - Sync local state with backend
- `getGameState(roomId)` - Get current game state from backend

#### Player Management
- `updatePlayerStatusOnline()` - Update player online status
- `spectateGameOnline()` - Enter spectator mode
- `leaveSpectateOnline()` - Leave spectator mode

#### Bankruptcy System
- `checkBankruptcyOnline()` - Check bankruptcy status
- `startBankruptcyFlowOnline()` - Initiate bankruptcy process
- `liquidateAssetsOnline()` - Liquidate player assets
- `eliminatePlayerOnline()` - Eliminate bankrupt player

### 3. Error Handling & Fallbacks

All API methods include automatic fallback to local logic:

```typescript
// Example: Roll dice with fallback
roll() {
  const { isOnline, rollDiceOnline, players, cur } = get();
  if (isOnline) {
    rollDiceOnline(players[cur]?.id || 0).then(success => {
      if (!success) {
        get()._fallbackRoll(); // Fallback to local
      }
    }).catch(() => {
      get()._fallbackRoll(); // Fallback on error
    });
  } else {
    get()._fallbackRoll(); // Use local directly
  }
}
```

### 4. State Synchronization

The API store automatically converts between backend and frontend state formats:

```typescript
convertBackendToFrontendState(backendState: BackendGameState): GameState {
  // Convert backend player format to frontend format
  // Convert backend board format to frontend format
  // Handle state mapping and transformations
}
```

## Usage Examples

### Starting an Online Game

```typescript
import { useApiGameStore } from '../store/apiGameStore';

function GameComponent() {
  const gameStore = useApiGameStore();
  
  const startOnlineGame = async () => {
    // Set room ID to enable online mode
    gameStore.setRoomId('room-123');
    
    // Start the game
    const success = await gameStore.startOnlineGame('room-123');
    if (success) {
      console.log('Game started successfully');
    }
  };
  
  return <button onClick={startOnlineGame}>Start Online Game</button>;
}
```

### Automatic Store Selection

```typescript
import { useAutoGameStore } from '../hooks/useGameStore';

function GameComponent() {
  // Automatically returns API store if online, local store if offline
  const gameStore = useAutoGameStore();
  
  const handleRoll = () => {
    // This will use API or local logic automatically
    gameStore.roll();
  };
  
  return <button onClick={handleRoll}>Roll Dice</button>;
}
```

### Manual Store Selection

```typescript
import { useGameStore } from '../hooks/useGameStore';

function GameComponent() {
  // Force online mode
  const gameStore = useGameStore(true);
  
  // Force offline mode  
  const localStore = useGameStore(false);
  
  return (
    <div>
      <button onClick={() => gameStore.roll()}>Online Roll</button>
      <button onClick={() => localStore.roll()}>Local Roll</button>
    </div>
  );
}
```

## API Endpoints

The game store integrates with the following backend endpoints:

### Game Actions
- `POST /api/game/{gameId}/roll` - Roll dice
- `POST /api/game/{gameId}/buy` - Buy property
- `POST /api/game/{gameId}/build` - Build house
- `POST /api/game/{gameId}/mortgage` - Mortgage property
- `POST /api/game/{gameId}/trade` - Trade properties
- `POST /api/game/{gameId}/end-turn` - End turn

### Game Management
- `POST /api/game/{roomId}/start` - Start game
- `GET /api/game/{roomId}/state` - Get game state
- `POST /api/game/{gameId}/finish` - Finish game

### Player Management
- `PUT /api/game/{gameId}/player-status` - Update player status
- `POST /api/game/{gameId}/spectate` - Spectate game
- `POST /api/game/{gameId}/leave-spectate` - Leave spectator mode

### Bankruptcy
- `POST /api/game/{gameId}/check-bankruptcy` - Check bankruptcy
- `POST /api/game/{gameId}/bankruptcy-flow` - Start bankruptcy flow
- `POST /api/game/{gameId}/liquidate-assets` - Liquidate assets
- `POST /api/game/{gameId}/eliminate-player` - Eliminate player

## Error Handling

The API store includes comprehensive error handling:

1. **Network Errors** - Automatic fallback to local logic
2. **API Errors** - User-friendly error messages via toast notifications
3. **State Conflicts** - Resync with backend when needed
4. **Connection Issues** - Graceful degradation to offline mode

## Performance Considerations

- API calls are debounced to prevent spam
- State synchronization is batched to reduce network requests
- Local state is updated immediately for responsive UI
- Background sync ensures data consistency

## Testing

The API store includes fallback mechanisms that make it easy to test:

```typescript
// Test with API failures
gameStore.setRoomId('test-room');
// Mock API failures to test fallback behavior

// Test offline mode
gameStore.setRoomId(null);
// All actions will use local logic
```

## Migration Guide

To migrate from local to API store:

1. Replace `useGameStore` with `useAutoGameStore` for automatic switching
2. Or use `useApiGameStore` for explicit API integration
3. Add error handling for API failures (already built-in)
4. Test both online and offline scenarios

## Future Enhancements

- Real-time WebSocket integration for live updates
- Optimistic updates for better perceived performance
- Advanced conflict resolution for concurrent games
- Enhanced error recovery mechanisms
