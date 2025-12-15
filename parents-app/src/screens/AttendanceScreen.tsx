import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useChild } from '../contexts/ChildContext';
import { useAttendance, useRefreshData } from '../hooks/useQueries';
import { OfflineIndicator } from '../components/OfflineIndicator';

const AttendanceScreen = () => {
  const { selectedChild, setSelectedChild, children } = useChild();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const currentMonth = currentDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long' 
  });

  const monthStr = currentDate.toISOString().slice(0, 7); // YYYY-MM format
  
  const { 
    data: attendanceData, 
    isLoading, 
    refetch: refetchAttendance 
  } = useAttendance(selectedChild?.id || '', monthStr);
  
  const { refreshAttendance } = useRefreshData();

  const getAbsentDays = (): number[] => {
    if (!attendanceData) return [];
    return attendanceData.records
      .filter(record => record.status === 'absent')
      .map(record => new Date(record.date).getDate());
  };

  const handleRefresh = async () => {
    if (!selectedChild) return;
    
    setIsRefreshing(true);
    try {
      await refreshAttendance(selectedChild.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Calendar data for October 2023
  const calendarDays = [
    { day: '', empty: true, date: 0 },
    { day: '', empty: true, date: 0 },
    { day: '', empty: true, date: 0 },
    { day: '', empty: true, date: 0 },
    { day: '', empty: true, date: 0 },
    { day: '', empty: true, date: 0 },
    { day: '', empty: true, date: 0 },
    { day: '1', empty: false, date: 1 },
    { day: '2', empty: false, date: 2 },
    { day: '3', empty: false, date: 3 },
    { day: '4', empty: false, date: 4 },
    { day: '5', empty: false, date: 5 },
    { day: '6', empty: false, date: 6 },
    { day: '7', empty: false, date: 7 },
    { day: '8', empty: false, date: 8 },
    { day: '9', empty: false, date: 9 },
    { day: '10', empty: false, date: 10 },
    { day: '11', empty: false, date: 11 },
    { day: '12', empty: false, date: 12 },
    { day: '13', empty: false, date: 13 },
    { day: '14', empty: false, date: 14 },
    { day: '15', empty: false, date: 15 },
    { day: '16', empty: false, date: 16 },
    { day: '17', empty: false, date: 17 },
    { day: '18', empty: false, date: 18 },
    { day: '19', empty: false, date: 19 },
    { day: '20', empty: false, date: 20 },
    { day: '21', empty: false, date: 21 },
    { day: '22', empty: false, date: 22 },
    { day: '23', empty: false, date: 23 },
    { day: '24', empty: false, date: 24 },
    { day: '25', empty: false, date: 25 },
    { day: '26', empty: false, date: 26 },
    { day: '27', empty: false, date: 27 },
    { day: '28', empty: false, date: 28 },
    { day: '29', empty: false, date: 29 },
    { day: '30', empty: false, date: 30 },
    { day: '31', empty: false, date: 31 },
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isAbsent = (date: number) => {
    return getAbsentDays().includes(date);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E5E5E5']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Attendance</Text>

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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>Loading attendance data...</Text>
          </View>
        ) : !selectedChild ? (
          <View style={styles.noChildContainer}>
            <Text style={styles.noChildText}>Please select a child to view attendance</Text>
          </View>
        ) : (
          <>
        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Month Header */}
          <View style={styles.monthHeader}>
            <Text style={styles.monthTitle}>{currentMonth}</Text>
            <View style={styles.monthNavigation}>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
                  setCurrentDate(newDate);
                }}
              >
                <Ionicons name="chevron-back" size={20} color="#666666" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.navButton}
                onPress={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() + 1);
                  setCurrentDate(newDate);
                }}
              >
                <Ionicons name="chevron-forward" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Week Days Header */}
          <View style={styles.weekDaysContainer}>
            {weekDays.map((day, index) => (
              <Text key={index} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((dayObj, index) => (
              <View key={index} style={styles.dayContainer}>
                {!dayObj.empty && (
                  <View style={[
                    styles.dayCircle,
                    isAbsent(dayObj.date) && styles.absentDay
                  ]}>
                    <Text style={[
                      styles.dayText,
                      isAbsent(dayObj.date) && styles.absentDayText
                    ]}>
                      {dayObj.day}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Attendance Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="calendar-outline" size={20} color="#333333" />
            <Text style={styles.summaryTitle}>Attendance Summary</Text>
          </View>
          <Text style={styles.attendancePercentage}>
            {attendanceData ? `${Math.round(attendanceData.summary.attendancePercentage)}%` : '0%'}
          </Text>
          <Text style={styles.summarySubtitle}>
            {attendanceData 
              ? `${attendanceData.summary.presentDays} of ${attendanceData.summary.totalDays} days present`
              : 'No data available'
            }
          </Text>
        </View>
        </>
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
  calendarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  monthNavigation: {
    flexDirection: 'row',
    gap: 10,
  },
  navButton: {
    padding: 4,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  weekDay: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    width: 35,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: '14.28%', // 7 days per week
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absentDay: {
    backgroundColor: '#DC2626',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  absentDayText: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  attendancePercentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
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
  noChildContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noChildText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default AttendanceScreen;