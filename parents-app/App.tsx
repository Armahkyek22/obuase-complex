import React, { useEffect, useState } from 'react';
import { Text, TextProps, StyleSheet, View } from 'react-native';
import * as Font from 'expo-font';
import { LeagueSpartan_400Regular, LeagueSpartan_700Bold } from '@expo-google-fonts/league-spartan';
import MainNavigator from './src/navigation/MainNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import { ChildProvider } from './src/contexts/ChildContext';
import { queryClient } from './src/services/queryClient';

// Create a custom Text component with the font
export const AppText: React.FC<TextProps> = (props) => {
  return (
    <Text
      {...props}
      style={[styles.defaultText, props.style]}
      allowFontScaling={false}
    />
  );
};

// Create a wrapper component to handle font loading
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'LeagueSpartan-Regular': LeagueSpartan_400Regular,
          'LeagueSpartan-Bold': LeagueSpartan_700Bold,
        });
      } catch (error) {
        setFontError(error as Error);
        console.error('Error loading fonts:', error);
      } finally {
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error loading fonts. Please restart the app.</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChildProvider>
            <MainNavigator />
          </ChildProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'LeagueSpartan-Regular',
  },
  boldText: {
    fontFamily: 'LeagueSpartan-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
});