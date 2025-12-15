import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { currentApiService as apiService } from '../config/api';
import { queryKeys, cacheInvalidation } from '../services/queryClient';
import { offlineStorage } from '../utils/offlineStorage';
import { useOnlineStatus } from './useNetworkStatus';
import { syncManager } from '../services/syncManager';
import { 
  Child, 
  AttendanceData, 
  GradeData, 
  Notification, 
  User, 
  NotificationSettings,
  ProfileData 
} from '../types';

// Children queries
export function useChildren() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: queryKeys.children.list(),
    queryFn: async (): Promise<Child[]> => {
      try {
        const data = await apiService.getChildren();
        // Cache the data for offline use
        await offlineStorage.cacheData(
          offlineStorage.getCacheKey.children(),
          data,
          24 * 60 * 60 * 1000 // 24 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData<Child[]>(
            offlineStorage.getCacheKey.children()
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    enabled: true,
  });
}

// Attendance queries
export function useAttendance(childId: string, month: string) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: queryKeys.attendance.byMonth(childId, month),
    queryFn: async (): Promise<AttendanceData> => {
      try {
        const data = await apiService.getAttendance(childId, month);
        // Cache the data for offline use
        await offlineStorage.cacheData(
          offlineStorage.getCacheKey.attendance(childId, month),
          data,
          6 * 60 * 60 * 1000 // 6 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData<AttendanceData>(
            offlineStorage.getCacheKey.attendance(childId, month)
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    enabled: !!childId && !!month,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Grades queries
export function useGrades(childId: string) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: queryKeys.grades.byChild(childId),
    queryFn: async (): Promise<GradeData[]> => {
      try {
        const data = await apiService.getGrades(childId);
        // Cache the data for offline use
        await offlineStorage.cacheData(
          offlineStorage.getCacheKey.grades(childId),
          data,
          12 * 60 * 60 * 1000 // 12 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData<GradeData[]>(
            offlineStorage.getCacheKey.grades(childId)
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    enabled: !!childId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Notifications queries
export function useNotifications() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: queryKeys.notifications.list(),
    queryFn: async (): Promise<Notification[]> => {
      try {
        const data = await apiService.getNotifications();
        // Cache the data for offline use
        await offlineStorage.cacheData(
          offlineStorage.getCacheKey.notifications(),
          data,
          30 * 60 * 1000 // 30 minutes
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData<Notification[]>(
            offlineStorage.getCacheKey.notifications()
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes when focused
  });
}

// User profile queries
export function useUserProfile() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: queryKeys.profile.user(),
    queryFn: async (): Promise<User> => {
      try {
        const data = await apiService.getUserProfile();
        // Cache the data for offline use
        await offlineStorage.cacheData(
          offlineStorage.getCacheKey.profile(),
          data,
          24 * 60 * 60 * 1000 // 24 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData<User>(
            offlineStorage.getCacheKey.profile()
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Mutations with offline support
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (isOnline) {
        return await apiService.markNotificationAsRead(notificationId);
      } else {
        // Queue for later sync
        await syncManager.queueOperation(
          'update',
          `/notifications/${notificationId}/read`,
          { isRead: true }
        );
      }
    },
    onSuccess: (_, notificationId) => {
      // Optimistically update the cache
      queryClient.setQueryData<Notification[]>(
        queryKeys.notifications.list(),
        (oldData) => {
          if (!oldData) return oldData;
          return oldData.map(notification =>
            notification.id === notificationId
              ? { ...notification, isRead: true }
              : notification
          );
        }
      );
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (profileData: ProfileData) => {
      if (isOnline) {
        return await apiService.updateProfile(profileData);
      } else {
        // Queue for later sync
        await syncManager.queueOperation(
          'update',
          '/profile',
          profileData
        );
      }
    },
    onSuccess: (_, profileData) => {
      // Invalidate and refetch profile data
      cacheInvalidation.invalidateUserData();
    },
  });
}

export function useUpdateNotificationSettings() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (settings: NotificationSettings) => {
      if (isOnline) {
        return await apiService.updateNotificationSettings(settings);
      } else {
        // Queue for later sync
        await syncManager.queueOperation(
          'update',
          '/profile/notifications',
          settings
        );
      }
    },
    onSuccess: () => {
      // Invalidate notification settings
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.notifications() });
    },
  });
}

// Utility hooks
export function useRefreshData() {
  const queryClient = useQueryClient();

  return {
    refreshAll: () => {
      queryClient.invalidateQueries();
    },
    refreshChildren: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.children.all });
    },
    refreshAttendance: (childId?: string) => {
      if (childId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.attendance.byChild(childId) });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.attendance.all });
      }
    },
    refreshGrades: (childId?: string) => {
      if (childId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.grades.byChild(childId) });
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.grades.all });
      }
    },
    refreshNotifications: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
    refreshProfile: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
    },
  };
}

// Payment and Results hooks
export function useResultPeriods(childId: string) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['resultPeriods', childId],
    queryFn: async () => {
      try {
        const data = await apiService.getResultPeriods(childId);
        // Cache the data for offline use
        await offlineStorage.cacheData(
          `result_periods_${childId}`,
          data,
          24 * 60 * 60 * 1000 // 24 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData(
            `result_periods_${childId}`
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    enabled: !!childId,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useTransactionHistory() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['transactionHistory'],
    queryFn: async () => {
      try {
        const data = await apiService.getTransactionHistory();
        // Cache the data for offline use
        await offlineStorage.cacheData(
          'transaction_history',
          data,
          60 * 60 * 1000 // 1 hour
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData(
            'transaction_history'
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function usePaymentMethods() {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['paymentMethods'],
    queryFn: async () => {
      try {
        const data = await apiService.getPaymentMethods();
        // Cache the data for offline use
        await offlineStorage.cacheData(
          'payment_methods',
          data,
          24 * 60 * 60 * 1000 // 24 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData(
            'payment_methods'
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();
  const isOnline = useOnlineStatus();

  return useMutation({
    mutationFn: async (paymentRequest: any) => {
      if (!isOnline) {
        throw new Error('Payment requires internet connection');
      }
      return await apiService.initiatePayment(paymentRequest);
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['resultPeriods'] });
      queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });
    },
  });
}

export function useResultsForPeriod(periodId: string) {
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['resultsForPeriod', periodId],
    queryFn: async () => {
      try {
        const data = await apiService.getResultsForPeriod(periodId);
        // Cache the data for offline use
        await offlineStorage.cacheData(
          `results_period_${periodId}`,
          data,
          24 * 60 * 60 * 1000 // 24 hours
        );
        return data;
      } catch (error) {
        // If offline, try to get cached data
        if (!isOnline) {
          const cachedData = await offlineStorage.getCachedData(
            `results_period_${periodId}`
          );
          if (cachedData) {
            return cachedData;
          }
        }
        throw error;
      }
    },
    enabled: !!periodId,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

// Cache management hook
export function useCacheManagement() {
  return {
    clearCache: async () => {
      await offlineStorage.clearAllCache();
    },
    cleanupExpiredCache: async () => {
      await offlineStorage.cleanupExpiredCache();
    },
    getCacheSize: async () => {
      return await offlineStorage.getCacheSize();
    },
  };
}