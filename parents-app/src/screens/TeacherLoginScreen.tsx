import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoadingSpinner from '../components/LoadingSpinner';

// Navigation type
type TeacherLoginScreenNavigationProp = StackNavigationProp<
  Record<string, object | undefined>,
  'TeacherLogin'
>;

// Validation function
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const TeacherLoginScreen = () => {
  const navigation = useNavigation<TeacherLoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { state, login } = useAuth();
  const { isLoading, error } = state;

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      // Clear any previous errors
      setErrors({});
      
      // Call the login function from AuthContext
      await login({ email, password }, 'teacher');
      
      // If we get here, login was successful
      // Navigation is handled by the AuthProvider after successful login
    } catch (error: unknown) {
      // Handle any errors from the login function
      console.error('Login error:', error);
      
      // Check if this is a network error
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      const isNetworkError = errorMessage.includes('Network error');
      
      setErrors(prevErrors => ({
        ...prevErrors,
        general: isNetworkError 
          ? 'Unable to connect to the server. Please check your internet connection.'
          : errorMessage
      }));
    }
  };

  return (
    <SafeAreaProvider>
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={styles.welcomeTitle}>Welcome Back, Teacher!</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>School Email *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your school email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
              {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              {!!errors.general && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#ef4444" style={styles.errorIcon} />
                  <Text style={styles.errorText}>
                    {errors.general}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                editable={!isLoading}
              />
              {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {!!error && (
              <View style={styles.authErrorContainer}>
                <Text style={styles.authErrorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <LoadingSpinner 
                    size="small" 
                    color="#FFFFFF"
                    text="Logging in..."
                  />
                </View>
              ) : (
                <Text style={styles.loginButtonText}>Login as Teacher</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchLoginButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.switchLoginText}>
                Are you a parent? Login here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 25,
    paddingTop: 100,
    paddingBottom: 40,
  },
  welcomeTitle: {
    fontSize: 64,
    fontFamily: 'LeagueSpartan-Bold',
    fontWeight: '700',
    color: '#333333',
    paddingTop: 50,
    textAlign: 'center',
  },
  inputContainer: {
    marginTop: 50,
  },
  label: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-Bold',
    fontWeight: '500',
    color: '#444444',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    fontFamily: 'LeagueSpartan-Bold',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
  },
  errorContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorIcon: {
    marginRight: 8,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 54,
    paddingHorizontal: 16,
  },
  loginButtonDisabled: {
    opacity: 0.9,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authErrorContainer: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  authErrorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  switchLoginButton: {
    marginTop: 20,
    padding: 12,
    alignItems: 'center',
  },
  switchLoginText: {
    color: '#3B82F6',
    fontFamily: 'LeagueSpartan-Bold',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TeacherLoginScreen;
