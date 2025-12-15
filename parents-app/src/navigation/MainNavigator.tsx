import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

// Import screens
import WelcomeScreen from '../screens/WelcomeScreen';
import ParentLoginScreen from '../screens/LoginScreen';
import TeacherLoginScreen from '../screens/TeacherLoginScreen';
import ResultsScreen from '../screens/ResultsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

// Import navigators
import ParentTabNavigator from './ParentTabNavigator';
import TeacherTabNavigator from './TeacherTabNavigator';

// Context
import { useAuth } from '../contexts/AuthContext';

// Types
import { RootStackParamList } from './types';

// Create stack navigator
const Stack = createStackNavigator<RootStackParamList>();

// Loading screen component
const AuthLoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#3B82F6" />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

// Main Navigator
const MainNavigator = () => {
  const { state } = useAuth();
  const { isAuthenticated, user } = state;
  const isTeacher = user?.role === 'teacher';

  // Show loading screen while checking auth state
  if (state.isLoading) {
    return <AuthLoadingScreen />;
  }

  // Define auth screens
  const renderAuthScreens = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />
      <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
    </Stack.Navigator>
  );

  // Define teacher app screens
  const renderTeacherApp = () => (
    <TeacherTabNavigator />
  );

  // Define parent app screens
  const renderParentApp = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="App" component={ParentTabNavigator} />
      <Stack.Screen name="Results" component={ResultsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
    </Stack.Navigator>
  );

  // Render the appropriate navigator based on auth state
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          isTeacher ? (
            <Stack.Screen name="TeacherApp" component={TeacherTabNavigator} />
          ) : (
            <>
              <Stack.Screen name="App" component={ParentTabNavigator} />
              <Stack.Screen name="Results" component={ResultsScreen} />
              <Stack.Screen name="Payment" component={PaymentScreen} />
              <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="ParentLogin" component={ParentLoginScreen} />
            <Stack.Screen name="TeacherLogin" component={TeacherLoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
  },
});

export default MainNavigator;
