import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { useSyncManager } from '../services/syncManager';

interface OfflineIndicatorProps {
  style?: any;
}

export function OfflineIndicator({ style }: OfflineIndicatorProps) {
  const networkStatus = useNetworkStatus();
  const { getSyncStatus } = useSyncManager();
  const [syncStatus, setSyncStatus] = React.useState({ pendingOperations: 0, isSync: false });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  const isOffline = !networkStatus.isConnected || !networkStatus.isInternetReachable;

  React.useEffect(() => {
    const updateSyncStatus = async () => {
      const status = await getSyncStatus();
      setSyncStatus(status);
    };

    updateSyncStatus();
    const interval = setInterval(updateSyncStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [getSyncStatus]);

  React.useEffect(() => {
    if (isOffline || syncStatus.pendingOperations > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOffline, syncStatus.pendingOperations, fadeAnim]);

  if (!isOffline && syncStatus.pendingOperations === 0) {
    return null;
  }

  const getStatusInfo = () => {
    if (isOffline && syncStatus.pendingOperations > 0) {
      return {
        icon: 'cloud-offline-outline' as const,
        text: `Offline • ${syncStatus.pendingOperations} pending`,
        color: '#F59E0B',
        backgroundColor: '#FEF3C7',
      };
    } else if (isOffline) {
      return {
        icon: 'cloud-offline-outline' as const,
        text: 'You are offline',
        color: '#EF4444',
        backgroundColor: '#FEE2E2',
      };
    } else if (syncStatus.isSync) {
      return {
        icon: 'sync-outline' as const,
        text: 'Syncing...',
        color: '#3B82F6',
        backgroundColor: '#DBEAFE',
      };
    } else {
      return {
        icon: 'time-outline' as const,
        text: `${syncStatus.pendingOperations} pending sync`,
        color: '#F59E0B',
        backgroundColor: '#FEF3C7',
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: statusInfo.backgroundColor,
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      <Ionicons 
        name={statusInfo.icon} 
        size={16} 
        color={statusInfo.color} 
        style={styles.icon}
      />
      <Text style={[styles.text, { color: statusInfo.color }]}>
        {statusInfo.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default OfflineIndicator;