import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';

type LoadingSpinnerProps = {
  size?: 'small' | 'large' | number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#3B82F6',
  text,
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator 
          size={size} 
          color={color} 
          style={styles.spinner}
        />
        {text && <Text style={[styles.text, { color }]}>{text}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  spinnerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  spinner: {
    marginBottom: 10,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoadingSpinner;
