import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import {
  LoginCredentials,
  AuthResponse,
  Child,
  AttendanceData,
  GradeData,
  Notification,
  ProfileData,
  NotificationSettings,
  ApiResponse,
  ApiError,
  User,
  PaymentMethod,
  Transaction,
  ResultPeriod,
  PaymentRequest,
} from '../types';

// Extend the axios config to include retry flag
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;
  private onSessionExpired?: () => Promise<void>;

  constructor() {
    // TODO: Replace with actual API base URL
    this.baseURL = process.env.EXPO_PUBLIC_API_URL || 'https://api.smartschoolconnect.com';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setSessionExpiredHandler(handler: () => Promise<void>) {
    this.onSessionExpired = handler;
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;
        
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Token expired, try to refresh
          try {
            await this.refreshToken();
            // Update the authorization header with new token
            const newToken = await SecureStore.getItemAsync('authToken');
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            // Retry the original request
            return this.client.request(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and notify auth context
            await this.clearTokens();
            if (this.onSessionExpired) {
              await this.onSessionExpired();
            }
            throw new Error('Session expired. Please log in again.');
          }
        }
        
        const apiError: ApiError = {
          message: error.message || 'An unexpected error occurred',
          code: error.code || 'UNKNOWN_ERROR',
          status: error.response?.status || 0,
        };
        
        throw apiError;
      }
    );
  }

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const authData = response.data.data;
        
        // Store tokens securely
        await SecureStore.setItemAsync('authToken', authData.token);
        await SecureStore.setItemAsync('refreshToken', authData.refreshToken);
        
        return authData;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post<ApiResponse<{ token: string; refreshToken: string }>>('/auth/refresh', {
        refreshToken,
      });

      if (response.data.success && response.data.data) {
        const { token, refreshToken: newRefreshToken } = response.data.data;
        
        await SecureStore.setItemAsync('authToken', token);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        
        return token;
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      await this.clearTokens();
    }
  }

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('refreshToken');
  }

  // Student data methods
  async getChildren(): Promise<Child[]> {
    try {
      const response = await this.client.get<ApiResponse<Child[]>>('/children');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch children');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getAttendance(childId: string, month: string): Promise<AttendanceData> {
    try {
      const response = await this.client.get<ApiResponse<AttendanceData>>(
        `/children/${childId}/attendance?month=${month}`
      );
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch attendance data');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getGrades(childId: string): Promise<GradeData[]> {
    try {
      const response = await this.client.get<ApiResponse<GradeData[]>>(`/children/${childId}/grades`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch grades');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getNotifications(): Promise<Notification[]> {
    try {
      const response = await this.client.get<ApiResponse<Notification[]>>('/notifications');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch notifications');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Profile management methods
  async getUserProfile(): Promise<User> {
    try {
      const response = await this.client.get<ApiResponse<User>>('/profile');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch user profile');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateProfile(profile: ProfileData): Promise<void> {
    try {
      const response = await this.client.put<ApiResponse<void>>('/profile', profile);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    try {
      const response = await this.client.put<ApiResponse<void>>('/profile/notifications', settings);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update notification settings');
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Utility methods
  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await this.client.patch(`/notifications/${notificationId}/read`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async checkAuthToken(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return false;
      
      // Verify token is still valid by making a simple API call
      const response = await this.client.get('/auth/verify');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Payment and Results methods
  async getResultPeriods(childId: string): Promise<ResultPeriod[]> {
    try {
      const response = await this.client.get<ApiResponse<ResultPeriod[]>>(`/children/${childId}/result-periods`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch result periods');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    try {
      const response = await this.client.get<ApiResponse<Transaction[]>>('/transactions');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch transaction history');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await this.client.get<ApiResponse<PaymentMethod[]>>('/payment-methods');
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch payment methods');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async initiatePayment(paymentRequest: PaymentRequest): Promise<{ transactionId: string; paymentUrl?: string }> {
    try {
      const response = await this.client.post<ApiResponse<{ transactionId: string; paymentUrl?: string }>>('/payments/initiate', paymentRequest);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to initiate payment');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getResultsForPeriod(periodId: string): Promise<GradeData[]> {
    try {
      const response = await this.client.get<ApiResponse<GradeData[]>>(`/result-periods/${periodId}/results`);
      
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Failed to fetch results for period');
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout. Please check your internet connection and try again.');
    }
    
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      return new Error('Network error. Please check your internet connection and try again.');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return new Error('Unable to connect to server. Please try again later.');
    }
    
    // Handle HTTP errors
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      switch (status) {
        case 400:
          return new Error(message || 'Invalid request. Please check your input.');
        case 401:
          return new Error('Authentication failed. Please check your credentials.');
        case 403:
          return new Error('Access denied. You don\'t have permission to perform this action.');
        case 404:
          return new Error('Resource not found. Please try again.');
        case 429:
          return new Error('Too many requests. Please wait a moment and try again.');
        case 500:
          return new Error('Server error. Please try again later.');
        case 503:
          return new Error('Service unavailable. Please try again later.');
        default:
          return new Error(message || `HTTP ${status}: An error occurred`);
      }
    }
    
    // Handle other errors
    if (error.message) {
      return new Error(error.message);
    }
    
    return new Error('An unexpected error occurred. Please try again.');
  }
}

export const apiService = new ApiService();
export default apiService;