// Set this to false to use the real API
const USE_MOCK_API = true;

export default {
  USE_MOCK_API,
  // Add other API configuration here
  API_TIMEOUT: 10000,
  // Add your API base URLs
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.smartschoolconnect.com',
  // Add any other configuration options
};
