import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG } from '../config/api';
import { mockApiService } from '../services/mockApi';

interface DeveloperSettingsProps {
  visible: boolean;
  onClose: () => void;
}

export function DeveloperSettings({ visible, onClose }: DeveloperSettingsProps) {
  const [useMockApi, setUseMockApi] = useState(API_CONFIG.USE_MOCK_API);
  const [networkDelay, setNetworkDelay] = useState(1000);

  if (!visible) return null;

  const handleToggleMockApi = (value: boolean) => {
    setUseMockApi(value);
    // Note: In a real app, you'd need to restart or reload to apply this change
    Alert.alert(
      'API Mode Changed',
      `Switched to ${value ? 'Mock' : 'Real'} API. Please restart the app for changes to take effect.`,
      [{ text: 'OK' }]
    );
  };

  const handleNetworkDelayChange = (delay: number) => {
    setNetworkDelay(delay);
    mockApiService.setNetworkDelay(delay);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Developer Settings</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Use Mock API</Text>
            <Switch
              value={useMockApi}
              onValueChange={handleToggleMockApi}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={useMockApi ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
          <Text style={styles.settingDescription}>
            Enable mock API for development and testing without a backend server
          </Text>
        </View>

        {useMockApi && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mock API Settings</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Network Delay</Text>
              <Text style={styles.settingValue}>{networkDelay}ms</Text>
            </View>
            
            <View style={styles.delayButtons}>
              {[500, 1000, 2000, 5000].map(delay => (
                <TouchableOpacity
                  key={delay}
                  style={[
                    styles.delayButton,
                    networkDelay === delay && styles.delayButtonActive
                  ]}
                  onPress={() => handleNetworkDelayChange(delay)}
                >
                  <Text style={[
                    styles.delayButtonText,
                    networkDelay === delay && styles.delayButtonTextActive
                  ]}>
                    {delay}ms
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.infoText}>
            Current API: {useMockApi ? 'Mock API' : 'Real API'}
          </Text>
          <Text style={styles.infoText}>
            Base URL: {API_CONFIG.BASE_URL}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: 400,
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  delayButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  delayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  delayButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  delayButtonText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  delayButtonTextActive: {
    color: '#FFFFFF',
  },
  infoText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
});

export default DeveloperSettings;