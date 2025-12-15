import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string;
  isWifiEnabled: boolean;
  details: any;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true, // Assume connected initially
    isInternetReachable: true,
    type: 'unknown',
    isWifiEnabled: false,
    details: null,
  });

  useEffect(() => {
    // Get initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isWifiEnabled: state.type === 'wifi',
        details: state.details,
      });
    });

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? false,
        type: state.type,
        isWifiEnabled: state.type === 'wifi',
        details: state.details,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return networkStatus;
}

// Hook for simple online/offline status
export function useOnlineStatus() {
  const networkStatus = useNetworkStatus();
  return networkStatus.isConnected && networkStatus.isInternetReachable;
}

// Hook for network type detection
export function useNetworkType() {
  const networkStatus = useNetworkStatus();
  return {
    type: networkStatus.type,
    isWifi: networkStatus.isWifiEnabled,
    isCellular: networkStatus.type === 'cellular',
    isEthernet: networkStatus.type === 'ethernet',
  };
}