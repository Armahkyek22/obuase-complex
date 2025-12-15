import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import { useNotifications, useRefreshData, useAttendance, useGrades } from '../hooks/useQueries';
import { OfflineIndicator } from '../components/OfflineIndicator';

const HomeScreen = ({ navigation }: any) => {
  const { state: authState } = useAuth();
  const { selectedChild, setSelectedChild, children } = useChild();
  const { data: notifications, isLoading: isLoadingNotifications, refetch: refetchNotifications } = useNotifications();
  const { refreshAll } = useRefreshData();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Get child-specific data for quick overview
  const currentMonth = new Date().toISOString().slice(0, 7);
  const { data: attendanceData } = useAttendance(selectedChild?.id || '', currentMonth);
  const { data: gradesData } = useGrades(selectedChild?.id || '');

  // Get the latest notification
  const latestNotification = React.useMemo(() => {
    if (!notifications || notifications.length === 0) return null;
    return notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }, [notifications]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return { color: '#10B981' }; // Green
    if (grade.includes('B')) return { color: '#3B82F6' }; // Blue
    if (grade.includes('C')) return { color: '#F59E0B' }; // Yellow
    return { color: '#EF4444' }; // Red
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return 'trending-up';
      case 'declining': return 'trending-down';
      default: return 'remove';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return '#10B981';
      case 'declining': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E5E5E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>

        {/* Child Tabs */}
        {children.length > 0 && (
          <View style={styles.childTabs}>
            {children.map((child) => (
              <TouchableOpacity
                key={child.id}
                style={[styles.childTab, selectedChild?.id === child.id && styles.activeChildTab]}
                onPress={() => setSelectedChild(child)}
              >
                <Text style={[styles.childTabText, selectedChild?.id === child.id && styles.activeChildTabText]}>
                  {child.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
        {/* Greeting */}
        <Text style={styles.greeting}>Hi, {authState.user?.name || 'Parent'}!</Text>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Attendance')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="calendar-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Results')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="ribbon-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Results</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Notifications')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.actionText}>Notifications</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Latest Announcement */}
        <View style={styles.section}>
          <View style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementTitle}>Latest Announcement</Text>
              <Ionicons name="notifications-outline" size={20} color="#3B82F6" />
            </View>
            {isLoadingNotifications ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : latestNotification ? (
              <>
                <Text style={styles.announcementText}>
                  {latestNotification.message}
                </Text>
                <Text style={styles.announcementDate}>
                  {new Date(latestNotification.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </>
            ) : (
              <Text style={styles.announcementText}>
                No recent announcements available.
              </Text>
            )}
          </View>
        </View>

        {/* Child Overview */}
        {selectedChild && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{selectedChild.name}'s Overview</Text>
            <View style={styles.overviewGrid}>
              {/* Attendance Summary */}
              <View style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                  <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                  <Text style={styles.overviewLabel}>Attendance</Text>
                </View>
                <Text style={styles.overviewValue}>
                  {attendanceData ? `${Math.round(attendanceData.summary.attendancePercentage)}%` : '--'}
                </Text>
                <Text style={styles.overviewSubtext}>This month</Text>
              </View>

              {/* Grades Summary */}
              <View style={styles.overviewCard}>
                <View style={styles.overviewHeader}>
                  <Ionicons name="ribbon-outline" size={20} color="#10B981" />
                  <Text style={styles.overviewLabel}>Subjects</Text>
                </View>
                <Text style={styles.overviewValue}>
                  {gradesData ? gradesData.length : 0}
                </Text>
                <Text style={styles.overviewSubtext}>Active subjects</Text>
              </View>
            </View>

            {/* Recent Performance */}
            {gradesData && gradesData.length > 0 && (
              <View style={styles.performanceCard}>
                <Text style={styles.performanceTitle}>Recent Performance</Text>
                {gradesData.slice(0, 3).map((grade, index) => (
                  <View key={index} style={styles.performanceItem}>
                    <Text style={styles.performanceSubject}>{grade.subject}</Text>
                    <View style={styles.performanceRight}>
                      <Text style={[styles.performanceGrade, getGradeColor(grade.currentGrade)]}>
                        {grade.currentGrade}
                      </Text>
                      <Ionicons
                        name={getTrendIcon(grade.trend)}
                        size={16}
                        color={getTrendColor(grade.trend)}
                      />
                    </View>
                  </View>
                ))}
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
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 20,
  },
  childTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  childTab: {
    paddingBottom: 8,
  },
  activeChildTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  childTabText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  activeChildTabText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '30%',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  announcementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  announcementText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  announcementDate: {
    fontSize: 12,
    color: '#999999',
  },

  overviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
  },
  yAxis: {
    justifyContent: 'space-between',
    height: '100%',
    marginRight: 15,
    paddingVertical: 5,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#999999',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
  },
  barContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    width: 60,
  },
  bar: {
    width: 50,
    borderRadius: 6,
  },
  blueBar: {
    backgroundColor: '#3B82F6',
    height: '85%',
  },
  greenBar: {
    backgroundColor: '#10B981',
    height: '45%',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 6,
    fontWeight: '500',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  overviewSubtext: {
    fontSize: 10,
    color: '#999999',
  },
  performanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  performanceSubject: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  performanceRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  performanceGrade: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;