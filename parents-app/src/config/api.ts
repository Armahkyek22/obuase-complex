import { apiService } from '../services/api';
import { mockApiService } from '../services/mockApi';

// Configuration for API service
export const API_CONFIG = {
  // Always use mock API for now
  USE_MOCK_API: true,
  
  // Mock API settings
  MOCK_API_DELAY: 1000, // Simulate network delay in ms
  
  // API endpoints (not used in mock mode)
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.smartschoolconnect.com',
  
  // Timeout settings
  TIMEOUT: 10000,
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};

// Configure mock API service
mockApiService.setNetworkDelay(API_CONFIG.MOCK_API_DELAY);

// Always use mock service for now
export const currentApiService = mockApiService;

// Type-safe API service interface
export type ApiServiceType = typeof apiService;

export default currentApiService;