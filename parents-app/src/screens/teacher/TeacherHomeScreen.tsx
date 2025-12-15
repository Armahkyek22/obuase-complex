import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Text from '../../components/Text';
import ClassCard from '../../components/ClassCard';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { mockTeacherClasses } from '../../mocks/teacherData';

interface Class {
  id: string;
  name: string;
  subjects: string[];
  time?: string;
  room?: string;
}

const TeacherHomeScreen = () => {
  // Get auth state from context
  const auth = useAuth();
  const user = auth?.state.user;
  const [classes, setClasses] = useState<Class[]>([]);
  // Sort classes by time
  const sortedClasses = [...classes].sort((a, b) => {
    if (!a.time || !b.time) return 0;
    return a.time.localeCompare(b.time);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllClasses, setShowAllClasses] = useState(false);

  // Function to check if a class's end time has passed
  const isClassEnded = (timeString: string): boolean => {
    if (!timeString) return false;
    
    // Extract the end time (format: "08:00 AM - 10:00 AM")
    const endTimeStr = timeString.split(' - ')[1];
    if (!endTimeStr) return false;
    
    // Get current time
    const now = new Date();
    const [time, period] = endTimeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    // Create date object for comparison (using today's date)
    const endTime = new Date();
    endTime.setHours(hours, minutes, 0, 0);
    
    return now > endTime;
  };
  
  // Filter out classes that have already ended and sort them
  const upcomingClasses = sortedClasses.filter(cls => !isClassEnded(cls.time || ''));
  const nextClass = upcomingClasses[0];

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      // Using mock data for now - replace with actual API call
      // const response = await api.get('/api/teacher/classes');
      // setClasses(response.data);
      setClasses(mockTeacherClasses);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        contentInsetAdjustmentBehavior="automatic"
      >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.teacherName}>{user?.name || 'Teacher'}</Text>
          <Text style={styles.classInfo}>Class Teacher: Grade 7A</Text>
        </View>
        <TouchableOpacity style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      {/* Today's Classes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your next class</Text>
          {upcomingClasses.length > 1 && (
            <TouchableOpacity onPress={() => setShowAllClasses(!showAllClasses)}>
              <Text style={styles.seeAll}>
                {showAllClasses ? 'Show Less' : `See All (${upcomingClasses.length})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {(() => {
          const renderClassCard = (cls: Class) => (
            <ClassCard
              key={cls.id}
              id={cls.id}
              name={cls.name}
              time={cls.time}
              subject={cls.subjects?.[0]}
              onPress={() => {
                console.log('Selected class:', cls.id);
              }}
            />
          );

          if (loading) {
            return (
              <View style={styles.loadingContainer} testID="loading-indicator">
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            );
          }

          if (error) {
            return (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={32} color={COLORS.text.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchClasses}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            );
          }

          if (upcomingClasses.length === 0) {
            if (sortedClasses.length > 0) {
              return (
                <View style={styles.emptyContainer}>
                  <Ionicons name="checkmark-circle-outline" size={48} color={COLORS.primary} />
                  <Text style={styles.emptyText}>No more classes for today</Text>
                </View>
              );
            }
            return (
              <View style={styles.emptyContainer}>
                <Ionicons name="school-outline" size={48} color={COLORS.primary} />
                <Text style={styles.emptyText}>No classes assigned yet</Text>
              </View>
            );
          }

          return (
            <View testID="classes-list">
              {showAllClasses ? (
                upcomingClasses.map(renderClassCard)
              ) : (
                renderClassCard(nextClass)
              )}
            </View>
          );
        })()}
      </View>

      {/* School Notifications & Alerts */}
      <View style={[styles.section, styles.notificationSection]}>
        <View style={styles.sectionHeader}>
          <View style={styles.notificationSectionHeader}>
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
              }}>
                <Image 
                  source={require('../../../assets/bell.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: COLORS.primary,
                  }}
                  resizeMode="contain"
                />
              </View>
            </View>
            <Text style={[styles.sectionTitle, { marginLeft: 12 }]}>School Notifications</Text>
          </View>
        </View>
        
        <View style={styles.notificationCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' }} 
            style={styles.notificationImage}
            resizeMode="cover"
          />
          <View style={styles.notificationCardContent}>
            <View style={styles.notificationCardHeader}>
              <Text style={styles.notificationTitle}>Staff Meeting</Text>
              <Text style={styles.notificationTime}>10:30 AM</Text>
            </View>
            <Text style={styles.notificationText} numberOfLines={2}>
              Reminder: Staff meeting at 3:30 PM in the library. Please bring your laptops and department reports.
            </Text>
          </View>
        </View>
        
        <View style={styles.notificationCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80' }} 
            style={styles.notificationImage}
            resizeMode="cover"
          />
          <View style={styles.notificationCardContent}>
            <View style={styles.notificationCardHeader}>
              <Text style={styles.notificationTitle}>Curriculum Update</Text>
              <Text style={styles.notificationTime}>Yesterday, 2:15 PM</Text>
            </View>
            <Text style={styles.notificationText} numberOfLines={2}>
              Updated curriculum guidelines for next semester have been uploaded to the portal. Please review the changes.
            </Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 0, // Remove top padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16, // Add padding to header instead of container
    marginBottom: 24,
  },
  greeting: {
    fontSize: 36,
    color: COLORS.text.primary,
    fontFamily: 'LeagueSpartan-Bold',
  },
  teacherName: {
    fontSize: 36,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.primary,
    marginVertical: 6,
  },
  classInfo: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  classTime: {
    fontSize: 16,
    color: COLORS.text.secondary,
    fontFamily: 'LeagueSpartan-Bold',
  },
  className: {
    fontSize: 20,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.text.primary,
    marginBottom: 6,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  subjectText: {
    fontSize: 18,
    color: COLORS.text.secondary,
    fontFamily: 'LeagueSpartan-Regular',
    lineHeight: 24,
  },
  moreSubjects: {
    color: COLORS.primary,
    fontSize: 18,
    fontFamily: 'LeagueSpartan-Bold',
    marginLeft: 8,
    alignSelf: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.text.error,
    marginVertical: 10,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontFamily: 'LeagueSpartan-Bold',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.text.secondary,
    marginTop: 16,
    textAlign: 'center',
    fontFamily: 'LeagueSpartan-Regular',
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.text.light,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'LeagueSpartan-Regular',
    color: COLORS.text.light,
    opacity: 0.9,
  },
  section: {
    marginBottom: 16,
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    padding: 16,
  },
  bellIconContainer: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationSection: {
    marginTop: 16,
    backgroundColor: COLORS.background.light,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: -4,
  },
  notificationSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationCard: {
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notificationImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E5E7EB',
  },
  notificationCardContent: {
    padding: 16,
  },
  notificationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'LeagueSpartan-SemiBold',
    color: COLORS.text.primary,
  },
  notificationText: {
    fontSize: 14,
    fontFamily: 'LeagueSpartan-Regular',
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'LeagueSpartan-Medium',
    color: COLORS.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan-SemiBold',
    color: COLORS.text.primary,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'LeagueSpartan-Medium',
    color: COLORS.primary,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'LeagueSpartan-SemiBold',
    marginBottom: 4,
    color: '#111827',
  },
  taskMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskSubject: {
    fontSize: 14,
    fontFamily: 'LeagueSpartan-Regular',
    color: COLORS.text.secondary,
  },
  taskDue: {
    fontSize: 14,
    fontFamily: 'LeagueSpartan-Medium',
    color: COLORS.primary,
  },
});

export default TeacherHomeScreen;
