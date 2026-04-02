import React from 'react';
import { useApiGameStore } from '../store/apiGameStore';

/**
 * Example component showing how to use the updated game store with API integration
 */
export const GameStoreExample: React.FC = () => {
  const gameStore = useApiGameStore();

  const handleStartOnlineGame = async () => {
    // Set the room ID to switch to online mode
    gameStore.setRoomId('room-123');
    
    // Start an online game
    const success = await gameStore.startOnlineGame('room-123');
    if (success) {
      console.log('Online game started successfully');
    } else {
      console.error('Failed to start online game');
    }
  };

  const handleRollDice = () => {
    gameStore.roll();
  };

  const handleBuyProperty = async () => {
    if (gameStore.gameId) {
      const success = await gameStore.buyPropertyOnline(0, '1');
      if (!success) {
        console.error('Failed to buy property');
      }
    }
  };

  const handleSyncWithBackend = async () => {
    await gameStore.syncWithBackend();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Game Store API Integration Example</h2>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Game Status</h3>
          <p>Online: {gameStore.isOnline ? 'Yes' : 'No'}</p>
          <p>Room ID: {gameStore.roomId || 'None'}</p>
          <p>Game ID: {gameStore.gameId || 'None'}</p>
          <p>Current Player: {gameStore.cur}</p>
          <p>Phase: {gameStore.phase}</p>
          <p>Syncing: {gameStore.syncing ? 'Yes' : 'No'}</p>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Actions</h3>
          <div className="space-y-2">
            <button
              onClick={handleStartOnlineGame}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start Online Game
            </button>
            
            <button
              onClick={handleRollDice}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
            >
              Roll Dice
            </button>
            
            <button
              onClick={handleBuyProperty}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-2"
            >
              Buy Property
            </button>
            
            <button
              onClick={handleSyncWithBackend}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 ml-2"
            >
              Sync with Backend
            </button>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h3 className="font-semibold mb-2">Game Log</h3>
          <div className="h-32 overflow-y-auto bg-gray-100 p-2 rounded">
            {gameStore.log.map((entry, index) => (
              <div key={index} className="text-sm">
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStoreExample;
