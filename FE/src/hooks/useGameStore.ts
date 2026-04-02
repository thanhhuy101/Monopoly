import { useGameStore as useLocalGameStore } from '../store/gameStore';
import { useApiGameStore } from '../store/apiGameStore';

export function useGameStore(isOnline: boolean = false) {
  const localStore = useLocalGameStore();
  const apiStore = useApiGameStore();
  
  // Return the appropriate store based on online status
  return isOnline ? apiStore : localStore;
}

// Export a hook that automatically determines online status
export function useAutoGameStore() {
  const apiStore = useApiGameStore();
  const isOnline = apiStore.isOnline;
  
  return useGameStore(isOnline);
}

// Export both stores for direct access if needed
export { useLocalGameStore, useApiGameStore };
