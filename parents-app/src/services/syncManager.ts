import React from 'react';
import { apiService } from './api';
import { offlineStorage, SyncQueueItem } from '../utils/offlineStorage';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

class SyncManager {
  private isSync = false;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly MAX_RETRY_COUNT = 3;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds

  // Start automatic sync when online
  startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(async () => {
      await this.syncPendingOperations();
    }, this.SYNC_INTERVAL);
  }

  // Stop automatic sync
  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Sync all pending operations
  async syncPendingOperations(): Promise<void> {
    if (this.isSync) return;

    try {
      this.isSync = true;
      const queue = await offlineStorage.getSyncQueue();
      
      if (queue.length === 0) return;

      console.log(`Syncing ${queue.length} pending operations...`);

      for (const item of queue) {
        try {
          await this.syncItem(item);
          await offlineStorage.removeFromSyncQueue(item.id);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Increment retry count
          const newRetryCount = item.retryCount + 1;
          
          if (newRetryCount >= this.MAX_RETRY_COUNT) {
            // Remove item after max retries
            await offlineStorage.removeFromSyncQueue(item.id);
            console.warn(`Removed item ${item.id} after ${this.MAX_RETRY_COUNT} failed attempts`);
          } else {
            // Update retry count
            await offlineStorage.updateSyncQueueItem(item.id, {
              retryCount: newRetryCount,
            });
          }
        }
      }

      console.log('Sync completed');
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      this.isSync = false;
    }
  }

  // Sync individual item
  private async syncItem(item: SyncQueueItem): Promise<void> {
    switch (item.type) {
      case 'create':
        await this.syncCreateOperation(item);
        break;
      case 'update':
        await this.syncUpdateOperation(item);
        break;
      case 'delete':
        await this.syncDeleteOperation(item);
        break;
      default:
        throw new Error(`Unknown sync operation type: ${item.type}`);
    }
  }

  // Sync create operations
  private async syncCreateOperation(item: SyncQueueItem): Promise<void> {
    // Implementation depends on the specific endpoint
    // This is a generic example
    const response = await fetch(item.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(item.data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // Sync update operations
  private async syncUpdateOperation(item: SyncQueueItem): Promise<void> {
    const response = await fetch(item.endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: JSON.stringify(item.data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // Sync delete operations
  private async syncDeleteOperation(item: SyncQueueItem): Promise<void> {
    const response = await fetch(item.endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  // Get authentication token
  private async getAuthToken(): Promise<string | null> {
    try {
      const { getItemAsync } = await import('expo-secure-store');
      return await getItemAsync('authToken');
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  // Add operations to sync queue for offline scenarios
  async queueOperation(
    type: 'create' | 'update' | 'delete',
    endpoint: string,
    data?: any
  ): Promise<void> {
    await offlineStorage.addToSyncQueue({
      type,
      endpoint,
      data,
    });
  }

  // Force sync now (manual trigger)
  async forcSync(): Promise<void> {
    await this.syncPendingOperations();
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    pendingOperations: number;
    isSync: boolean;
    lastSyncAttempt?: number;
  }> {
    const queue = await offlineStorage.getSyncQueue();
    return {
      pendingOperations: queue.length,
      isSync: this.isSync,
      lastSyncAttempt: queue.length > 0 ? Math.max(...queue.map(item => item.timestamp)) : undefined,
    };
  }

  // Clear all pending operations
  async clearPendingOperations(): Promise<void> {
    await offlineStorage.clearSyncQueue();
  }
}

export const syncManager = new SyncManager();

// Hook for using sync manager in components
export function useSyncManager() {
  const networkStatus = useNetworkStatus();

  // Auto-start sync when online
  React.useEffect(() => {
    if (networkStatus.isConnected && networkStatus.isInternetReachable) {
      syncManager.startAutoSync();
    } else {
      syncManager.stopAutoSync();
    }

    return () => {
      syncManager.stopAutoSync();
    };
  }, [networkStatus.isConnected, networkStatus.isInternetReachable]);

  return {
    syncNow: () => syncManager.forcSync(),
    queueOperation: syncManager.queueOperation.bind(syncManager),
    getSyncStatus: () => syncManager.getSyncStatus(),
    clearPending: () => syncManager.clearPendingOperations(),
  };
}

export default syncManager;