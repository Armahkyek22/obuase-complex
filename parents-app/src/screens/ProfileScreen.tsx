import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useChild } from '../contexts/ChildContext';
import { DeveloperSettings } from '../components/DeveloperSettings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }: any) => {
  const { state: authState, logout } = useAuth();
  const { children } = useChild();
  const [showDeveloperSettings, setShowDeveloperSettings] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const insets = useSafeAreaInsets();
  
  const user = authState.user;

  const getChildColor = (index: number): string => {
    const colors = ['#84CC16', '#D946EF', '#F59E0B', '#EF4444', '#06B6D4'];
    return colors[index % colors.length];
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error('Logout error:', error);
            }
          }
        },
      ]
    );
  };

  const handleTitleTap = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);
    
    if (newTapCount >= 3) {
      setShowDeveloperSettings(true);
      setTapCount(0);
    }
    
    // Reset tap count after 2 seconds
    setTimeout(() => setTapCount(0), 2000);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E5E5E5']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 65 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Parent Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.parentAvatar}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={12} color="#FFFFFF" />
            </View>
          </View>
          <TouchableOpacity onPress={handleTitleTap} activeOpacity={0.7}>
            <Text style={styles.parentName}>{user?.name || 'Parent'}</Text>
            <Text style={styles.parentRole}>{user?.role === 'parent' ? 'Parent & Guardian' : 'Guardian'}</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information Card */}
        <View style={styles.contactCard}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          
          <View style={styles.contactItem}>
            <Ionicons name="person-outline" size={20} color="#666666" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Name</Text>
              <Text style={styles.contactValue}>{user?.name || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#666666" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Phone Number</Text>
              <Text style={styles.contactValue}>{user?.phone || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#666666" />
            <View style={styles.contactText}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{user?.email || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* My Children Card */}
        <View style={styles.childrenCard}>
          <Text style={styles.cardTitle}>My Children</Text>
          
          {children.length > 0 ? (
            children.map((child, index) => (
              <TouchableOpacity key={child.id} style={styles.childItem}>
                <View style={styles.childInfo}>
                  <View style={[styles.childAvatar, { backgroundColor: getChildColor(index) }]}>
                    <Ionicons name="person" size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.childDetails}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <View style={styles.gradeContainer}>
                      <Ionicons name="school-outline" size={14} color="#666666" />
                      <Text style={styles.childGrade}>{child.grade}</Text>
                    </View>
                    <View style={styles.schoolContainer}>
                      <Ionicons name="location-outline" size={14} color="#666666" />
                      <Text style={styles.childSchool}>{child.school}</Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-down" size={20} color="#666666" />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noChildrenText}>No children registered</Text>
          )}
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.transactionButton}
          onPress={() => navigation.navigate('TransactionHistory')}
        >
          <Ionicons name="receipt-outline" size={20} color="#3B82F6" />
          <Text style={styles.transactionButtonText}>Transaction History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <DeveloperSettings
        visible={showDeveloperSettings}
        onClose={() => setShowDeveloperSettings(false)}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  parentAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  parentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  parentRole: {
    fontSize: 16,
    color: '#666666',
  },
  contactCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  contactText: {
    marginLeft: 15,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  childrenCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  childDetails: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childGrade: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 4,
  },
  editButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  schoolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  childSchool: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  noChildrenText: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  transactionButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  transactionButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;