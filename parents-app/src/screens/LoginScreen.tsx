import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword, validateGhanaianPhone } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';

const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { state, login, clearError } = useAuth();
  const { isLoading, error } = state;

  // Clear auth error when component mounts or when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [email, password, phone]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Validate phone (optional but if provided, should be valid)
    if (phone.trim()) {
      const phoneValidation = validateGhanaianPhone(phone);
      if (!phoneValidation.isValid) {
        newErrors.phone = phoneValidation.message || 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login({
        email: email.trim(),
        password: password.trim(),
        phone: phone.trim() || undefined,
      });
      // Navigation will happen automatically via MainNavigator
    } catch (error) {
      // Error is handled by AuthContext and displayed via state.error
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
        {/* Header with branding */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>SmartSchool Connect</Text>
        </View>

        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <LinearGradient
            colors={['#7DD3FC', '#38BDF8']}
            style={styles.illustrationBackground}
          >
            {/* Parent and Child Illustration Placeholder */}
            <View style={styles.illustrationPlaceholder}>
              <View style={styles.parentFigure}>
                <View style={styles.parentHead} />
                <View style={styles.parentBody} />
              </View>
              <View style={styles.childFigure}>
                <View style={styles.childHead} />
                <View style={styles.childBody} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Login Form */}
        <View style={styles.formContainer}>
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone (Optional)</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Enter your phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
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
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {error && (
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
              <LoadingSpinner 
                size="small" 
                color="#FFFFFF"
                text="Logging in..."
              />
            ) : (
              <Text style={styles.loginButtonText}>Login as Parent</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  illustrationContainer: {
    height: 300,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  illustrationBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  illustrationPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  parentFigure: {
    alignItems: 'center',
    marginRight: 20,
  },
  parentHead: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A8A',
    marginBottom: 10,
  },
  parentBody: {
    width: 80,
    height: 120,
    borderRadius: 40,
    backgroundColor: '#DC2626',
  },
  childFigure: {
    alignItems: 'center',
    marginTop: 40,
  },
  childHead: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F97316',
    marginBottom: 8,
  },
  childBody: {
    width: 60,
    height: 90,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40, // Add padding at the bottom of the form
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 8,
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
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginScreen;