import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Secure storage for sensitive data (tokens, credentials)
export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error storing secure item:', error);
      throw error;
    }
  },

  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving secure item:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing secure item:', error);
      throw error;
    }
  },
};

// Regular storage for non-sensitive data (preferences, cache)
export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing item:', error);
      throw error;
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving item:', error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  // Secure storage keys
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  
  // Regular storage keys
  USER_PREFERENCES: 'userPreferences',
  CACHED_ATTENDANCE: 'cachedAttendance',
  CACHED_GRADES: 'cachedGrades',
  CACHED_NOTIFICATIONS: 'cachedNotifications',
  SELECTED_CHILD_ID: 'selectedChildId',
  NOTIFICATION_SETTINGS: 'notificationSettings',
} as const;