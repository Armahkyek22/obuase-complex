import { QueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a client for React Query with enhanced caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes for most data
      // Cache time: how long data stays in cache when not being used
      gcTime: 24 * 60 * 60 * 1000, // 24 hours for offline support
      // Retry failed requests with exponential backoff
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Retry delay increases exponentially
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Don't refetch on window focus (mobile app)
      refetchOnWindowFocus: false,
      // Refetch on reconnect for fresh data
      refetchOnReconnect: true,
      // Enable background refetching
      refetchOnMount: 'always',
      // Network mode for offline support
      networkMode: 'offlineFirst',
    },
    mutations: {
      // Retry failed mutations once
      retry: (failureCount, error: any) => {
        // Don't retry on client errors (4xx)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 1;
      },
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

// Cache persistence utilities
export const cacheUtils = {
  // Save query data to AsyncStorage
  async persistQueryData(key: string, data: any): Promise<void> {
    try {
      const serializedData = JSON.stringify({
        data,
        timestamp: Date.now(),
      });
      await AsyncStorage.setItem(`query_cache_${key}`, serializedData);
    } catch (error) {
      console.warn('Failed to persist query data:', error);
    }
  },

  // Load query data from AsyncStorage
  async loadQueryData(key: string, maxAge: number = 24 * 60 * 60 * 1000): Promise<any> {
    try {
      const serializedData = await AsyncStorage.getItem(`query_cache_${key}`);
      if (!serializedData) return null;

      const { data, timestamp } = JSON.parse(serializedData);
      
      // Check if data is still valid
      if (Date.now() - timestamp > maxAge) {
        await AsyncStorage.removeItem(`query_cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to load query data:', error);
      return null;
    }
  },

  // Clear expired cache entries
  async clearExpiredCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('query_cache_'));
      
      for (const key of cacheKeys) {
        const data = await this.loadQueryData(key.replace('query_cache_', ''));
        if (!data) {
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.warn('Failed to clear expired cache:', error);
    }
  },
};

// Query keys for consistent caching with hierarchical structure
export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  
  // Children
  children: {
    all: ['children'] as const,
    list: () => [...queryKeys.children.all, 'list'] as const,
    detail: (childId: string) => [...queryKeys.children.all, 'detail', childId] as const,
  },
  
  // Attendance
  attendance: {
    all: ['attendance'] as const,
    byChild: (childId: string) => [...queryKeys.attendance.all, childId] as const,
    byMonth: (childId: string, month: string) => [...queryKeys.attendance.byChild(childId), month] as const,
    summary: (childId: string) => [...queryKeys.attendance.byChild(childId), 'summary'] as const,
  },
  
  // Grades
  grades: {
    all: ['grades'] as const,
    byChild: (childId: string) => [...queryKeys.grades.all, childId] as const,
    bySubject: (childId: string, subject: string) => [...queryKeys.grades.byChild(childId), subject] as const,
    summary: (childId: string) => [...queryKeys.grades.byChild(childId), 'summary'] as const,
  },
  
  // Notifications
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    unread: () => [...queryKeys.notifications.all, 'unread'] as const,
    byType: (type: string) => [...queryKeys.notifications.all, 'type', type] as const,
  },
  
  // Profile
  profile: {
    all: ['profile'] as const,
    user: () => [...queryKeys.profile.all, 'user'] as const,
    settings: () => [...queryKeys.profile.all, 'settings'] as const,
    notifications: () => [...queryKeys.profile.all, 'notifications'] as const,
  },
} as const;

// Cache invalidation utilities
export const cacheInvalidation = {
  // Invalidate all data for a specific child
  invalidateChildData: (childId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.children.detail(childId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byChild(childId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.grades.byChild(childId) });
  },

  // Invalidate all user-related data
  invalidateUserData: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.children.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
  },

  // Invalidate all cached data (for logout)
  invalidateAllData: () => {
    queryClient.clear();
  },

  // Refresh specific data types
  refreshAttendanceData: (childId?: string) => {
    if (childId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byChild(childId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
    }
  },

  refreshGradesData: (childId?: string) => {
    if (childId) {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.byChild(childId) });
    } else {
      queryClient.invalidateQueries({ queryKey: queryKeys.grades.all });
    }
  },

  refreshNotifications: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
  },
};