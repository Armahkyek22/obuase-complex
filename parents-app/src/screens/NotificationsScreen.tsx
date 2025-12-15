import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications, useMarkNotificationAsRead, useRefreshData } from '../hooks/useQueries';
import { useChild } from '../contexts/ChildContext';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { Notification } from '../types';

const NotificationsScreen = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { children } = useChild();
  
  const { 
    data: notifications = [], 
    isLoading, 
    refetch: refetchNotifications 
  } = useNotifications();
  
  const markAsReadMutation = useMarkNotificationAsRead();
  const { refreshNotifications } = useRefreshData();

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        await markAsReadMutation.mutateAsync(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshNotifications();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E5E5E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <OfflineIndicator />
      
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <TouchableOpacity 
                  key={notification.id} 
                  style={[
                    styles.notificationCard,
                    !notification.isRead && styles.unreadNotification
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                      <Ionicons 
                        name={notification.priority === 'high' ? "notifications" : "notifications-outline"} 
                        size={20} 
                        color="#3B82F6" 
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[
                        styles.notificationTitle,
                        !notification.isRead && styles.unreadTitle
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <View style={styles.notificationFooter}>
                        <Text style={[
                          styles.notificationDate,
                          !notification.isRead && styles.unreadDate
                        ]}>
                          {formatDate(notification.date)}
                        </Text>
                        {notification.childId && (
                          <View style={styles.childTag}>
                            <Text style={styles.childTagText}>
                              {children.find(child => child.id === notification.childId)?.name || 'Child'}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {!notification.isRead && (
                      <View style={styles.unreadIndicator} />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noNotificationsContainer}>
                <Ionicons name="notifications-outline" size={48} color="#CCCCCC" />
                <Text style={styles.noNotificationsText}>No notifications available</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationsList: {
    paddingBottom: 30,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 4,
  },
  importantTitle: {
    color: '#333333',
    fontWeight: '600',
  },
  notificationDate: {
    fontSize: 12,
    color: '#999999',
  },
  importantDate: {
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  unreadNotification: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  unreadTitle: {
    color: '#333333',
    fontWeight: '600',
  },
  unreadDate: {
    color: '#666666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
    lineHeight: 18,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#999999',
    marginTop: 16,
    textAlign: 'center',
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  childTag: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  childTagText: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default NotificationsScreen;