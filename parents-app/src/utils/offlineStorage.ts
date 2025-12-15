import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './storage';

export interface CachedData<T = any> {
  data: T;
  timestamp: number;
  expiresAt?: number;
  version: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data?: any;
  timestamp: number;
  retryCount: number;
}

class OfflineStorageManager {
  private readonly VERSION = '1.0.0';
  private readonly DEFAULT_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
  private readonly SYNC_QUEUE_KEY = 'offline_sync_queue';

  // Cache data with expiration
  async cacheData<T>(key: string, data: T, expiryMs?: number): Promise<void> {
    try {
      const cachedData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        expiresAt: expiryMs ? Date.now() + expiryMs : Date.now() + this.DEFAULT_EXPIRY,
        version: this.VERSION,
      };

      await AsyncStorage.setItem(key, JSON.stringify(cachedData));
    } catch (error) {
      console.error('Failed to cache data:', error);
    }
  }

  // Retrieve cached data
  async getCachedData<T>(key: string): Promise<T | null> {
    try {
      const cachedDataString = await AsyncStorage.getItem(key);
      if (!cachedDataString) return null;

      const cachedData: CachedData<T> = JSON.parse(cachedDataString);

      // Check if data has expired
      if (cachedData.expiresAt && Date.now() > cachedData.expiresAt) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      // Check version compatibility
      if (cachedData.version !== this.VERSION) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.error('Failed to retrieve cached data:', error);
      return null;
    }
  }

  // Check if cached data exists and is valid
  async isCacheValid(key: string): Promise<boolean> {
    try {
      const cachedDataString = await AsyncStorage.getItem(key);
      if (!cachedDataString) return false;

      const cachedData: CachedData = JSON.parse(cachedDataString);
      
      // Check expiration
      if (cachedData.expiresAt && Date.now() > cachedData.expiresAt) {
        return false;
      }

      // Check version
      if (cachedData.version !== this.VERSION) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  // Remove cached data
  async removeCachedData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove cached data:', error);
    }
  }

  // Clear all cached data
  async clearAllCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(STORAGE_KEYS.CACHED_ATTENDANCE) ||
        key.startsWith(STORAGE_KEYS.CACHED_GRADES) ||
        key.startsWith(STORAGE_KEYS.CACHED_NOTIFICATIONS) ||
        key.startsWith('query_cache_')
      );
      
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  // Sync queue management for offline operations
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const newItem: SyncQueueItem = {
        ...item,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        retryCount: 0,
      };

      queue.push(newItem);
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Failed to add item to sync queue:', error);
    }
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    try {
      const queueString = await AsyncStorage.getItem(this.SYNC_QUEUE_KEY);
      return queueString ? JSON.parse(queueString) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  async removeFromSyncQueue(itemId: string): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const filteredQueue = queue.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Failed to remove item from sync queue:', error);
    }
  }

  async updateSyncQueueItem(itemId: string, updates: Partial<SyncQueueItem>): Promise<void> {
    try {
      const queue = await this.getSyncQueue();
      const itemIndex = queue.findIndex(item => item.id === itemId);
      
      if (itemIndex !== -1) {
        queue[itemIndex] = { ...queue[itemIndex], ...updates };
        await AsyncStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
      }
    } catch (error) {
      console.error('Failed to update sync queue item:', error);
    }
  }

  async clearSyncQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.SYNC_QUEUE_KEY);
    } catch (error) {
      console.error('Failed to clear sync queue:', error);
    }
  }

  // Cache management utilities
  async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(STORAGE_KEYS.CACHED_ATTENDANCE) ||
        key.startsWith(STORAGE_KEYS.CACHED_GRADES) ||
        key.startsWith(STORAGE_KEYS.CACHED_NOTIFICATIONS) ||
        key.startsWith('query_cache_')
      );

      let totalSize = 0;
      for (const key of cacheKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Failed to calculate cache size:', error);
      return 0;
    }
  }

  async cleanupExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => 
        key.startsWith(STORAGE_KEYS.CACHED_ATTENDANCE) ||
        key.startsWith(STORAGE_KEYS.CACHED_GRADES) ||
        key.startsWith(STORAGE_KEYS.CACHED_NOTIFICATIONS) ||
        key.startsWith('query_cache_')
      );

      const expiredKeys: string[] = [];

      for (const key of cacheKeys) {
        const isValid = await this.isCacheValid(key);
        if (!isValid) {
          expiredKeys.push(key);
        }
      }

      if (expiredKeys.length > 0) {
        await AsyncStorage.multiRemove(expiredKeys);
        console.log(`Cleaned up ${expiredKeys.length} expired cache entries`);
      }
    } catch (error) {
      console.error('Failed to cleanup expired cache:', error);
    }
  }

  // Specific cache keys for different data types
  getCacheKey = {
    attendance: (childId: string, month: string) => `${STORAGE_KEYS.CACHED_ATTENDANCE}_${childId}_${month}`,
    grades: (childId: string) => `${STORAGE_KEYS.CACHED_GRADES}_${childId}`,
    notifications: () => STORAGE_KEYS.CACHED_NOTIFICATIONS,
    children: () => 'cached_children',
    profile: () => 'cached_profile',
  };
}

export const offlineStorage = new OfflineStorageManager();
export default offlineStorage;