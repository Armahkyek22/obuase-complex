import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Import teacher screens
import TeacherHomeScreen from '../screens/teacher/TeacherHomeScreen';
import TeacherProfileScreen from '../screens/teacher/TeacherProfileScreen';
import AttendanceMarking from '../screens/teacher/AttendanceMarking';
import AssessmentStack from './AssessmentStack';

// Types
import { TeacherTabParamList } from './types';

const Tab = createBottomTabNavigator<TeacherTabParamList>();

const TeacherTabNavigator = () => {
  const { state: { user } } = useAuth();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'LeagueSpartan-semibold',
          fontWeight: '600',
          marginTop: 6,
        },
        tabBarItemStyle: {
          padding: 0,
          margin: 0,
          height: 60,
          marginTop: 16,
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          backgroundColor: 'rgba(245, 245, 245, 0.6)',
          height: 100,
          paddingHorizontal: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          borderTopWidth: 2,
          borderTopColor: 'rgba(200, 200, 200, 0.7)',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TeacherHome"
        component={TeacherHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#EFF6FF' : 'transparent',
            }}>
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: focused ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              }}>
                <Image 
                  source={require('../../assets/home (1).png')} 
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: color,
                  }} 
                  resizeMode="contain"
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Assessments"
        component={AssessmentStack}
        options={{
          tabBarLabel: 'Assessment',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#EFF6FF' : 'transparent',
            }}>
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: focused ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              }}>
                <Image 
                  source={require('../../assets/open-book.png')} 
                  style={{
                    width: 28,
                    height: 28,
                    tintColor: color,
                  }} 
                  resizeMode="contain"
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ClassAttendance"
        component={AttendanceMarking}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#EFF6FF' : 'transparent',
            }}>
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: focused ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              }}>
                <Ionicons 
                  name='calendar-outline' 
                  size={26} 
                  color={color}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TeacherProfile"
        component={TeacherProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: focused ? '#EFF6FF' : 'transparent',
            }}>
              <View style={{
                width: 40,
                height: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 20,
                backgroundColor: focused ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
              }}>
                <Image 
                  source={require('../../assets/user.png')} 
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: color,
                  }} 
                  resizeMode="contain"
                />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TeacherTabNavigator;
