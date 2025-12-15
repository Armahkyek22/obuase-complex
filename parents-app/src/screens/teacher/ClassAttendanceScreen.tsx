import { StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import React from 'react';

const ClassAttendanceScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Class Attendance</Text>
        {/* Add your attendance content here */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ClassAttendanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});