import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginCredentials, User, Child, UserRole } from '../types';
import { currentApiService as apiService } from '../config/api';

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  children: [],
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; children: Child[] } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESTORE_SESSION'; payload: { user: User; children: Child[] } };

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        children: action.payload.children,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        children: [],
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload.user,
        children: action.payload.children,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Handle automatic logout on session expiration
  const handleSessionExpired = async () => {
    try {
      await apiService.clearTokens();
    } catch (error) {
      console.warn('Error clearing tokens on session expiration:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const checkExistingSession = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const hasToken = await apiService.checkAuthToken();
      if (hasToken) {
        // Try to get user data to validate token
        try {
          const children = await apiService.getChildren();
          // Get user profile data
          const userProfile = await apiService.getUserProfile();

          dispatch({
            type: 'RESTORE_SESSION',
            payload: { user: userProfile, children },
          });
        } catch (error) {
          // Token is invalid or API call failed, clear tokens and logout
          await apiService.clearTokens();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      // Token check failed
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check for existing session on app start and set up session expired handler
  useEffect(() => {
    checkExistingSession();

    // Set up session expired handler
    apiService.setSessionExpiredHandler(handleSessionExpired);
  }, []);

  const login = async (credentials: LoginCredentials, userType: UserRole = 'parent') => {
    try {
      dispatch({ type: 'LOGIN_START' });

      // Pass user type to the API service
      const authResponse = await apiService.login({
        ...credentials,
        userType,
      });

      // If user type is teacher, they might not have children
      const children = authResponse.children || [];

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: { ...authResponse.user, role: userType },
          children,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const refreshToken = async () => {
    try {
      await apiService.refreshToken();
    } catch (error) {
      // If refresh fails, logout user
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    refreshToken,
    clearError,
    handleSessionExpired,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;