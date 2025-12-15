import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import CustomWheelPicker from '../../components/CustomWheelPicker';
import { COLORS } from '../../constants/colors';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AssessmentStackParamList } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
// Mock data - in a real app, this would come from your backend/API
const mockTeacherAssignments = [
  { class: 'Primary 4B', subject: 'Mathematics' },
  { class: 'Primary 4B', subject: 'Science' },
  { class: 'JHS 2C', subject: 'Mathematics' },
  { class: 'JHS 2C', subject: 'Computing' },
];

const terms = ['Term 1', 'Term 2', 'Term 3'];

// Helper function to get unique classes from teacher's assignments
const getTeacherClasses = (assignments: {class: string, subject: string}[]) => {
  const uniqueClasses = new Set<string>();
  for (const assignment of assignments) {
    uniqueClasses.add(assignment.class);
  }
  return Array.from(uniqueClasses);
};

// Helper function to get subjects for a specific class
const getSubjectsForClass = (assignments: {class: string, subject: string}[], className: string) => {
  return assignments
    .filter(assignment => assignment.class === className)
    .map(assignment => assignment.subject);
};

type AssessmentDashboardNavigationProp = NativeStackNavigationProp<AssessmentStackParamList, 'AssessmentDashboard'>;

interface AssessmentDashboardProps {
  navigation: AssessmentDashboardNavigationProp;
}

const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({ navigation }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(terms[0]);
  const [teacherClasses, setTeacherClasses] = useState<string[]>([]);
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Helper function to get subject placeholder text
  const getSubjectPlaceholder = (hasSelectedClass: boolean, hasSubjects: boolean) => {
    if (!hasSelectedClass) return 'Select class first';
    return hasSubjects ? '---' : 'No subjects available';
  };

  // In a real app, this would be fetched from an API
  useEffect(() => {
    // Simulate API call to get teacher's assigned classes and subjects
    const teacherAssignedClasses = getTeacherClasses(mockTeacherAssignments);
    setTeacherClasses(teacherAssignedClasses);
  }, []);

  // Update available subjects when selected class changes
  useEffect(() => {
    if (selectedClass) {
      const subjects = getSubjectsForClass(mockTeacherAssignments, selectedClass);
      setAvailableSubjects(subjects);
      // Reset selected subject when class changes
      setSelectedSubject('');
    } else {
      setAvailableSubjects([]);
    }
  }, [selectedClass]);

  const handleStartAssessment = () => {
    if (!selectedClass || !selectedSubject || !selectedTerm) {
      Alert.alert('Incomplete Selection', 'Please select class, subject, and term before continuing.');
      return;
    }
    
    navigation.navigate('StudentSelection', {
      class: selectedClass,
      subject: selectedSubject,
      term: selectedTerm,
    });
  };

  const handleViewSummary = () => {
    if (!selectedClass || !selectedSubject || !selectedTerm) {
      Alert.alert('Incomplete Selection', 'Please select class, subject, and term before viewing summary.');
      return;
    }
    
    // Mock data - in a real app, this would come from your backend/API
    const mockScores = [
      { studentId: '1', studentName: 'John Doe', score: 85 },
      { studentId: '2', studentName: 'Jane Smith', score: 92 },
      { studentId: '3', studentName: 'Bob Johnson', score: 78 },
    ];
    
    navigation.navigate('AssessmentSummary', {
      class: selectedClass,
      subject: selectedSubject,
      term: selectedTerm,
      assessmentType: 'All',
      maxScore: 100,
      scores: mockScores,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Assessment Dashboard</Text>
        
        <View style={styles.card}>
          <Text style={styles.label}>Class</Text>
          <View style={styles.pickerContainer}>
            <CustomWheelPicker
              items={[
                { label: '---', value: '' },
                ...teacherClasses.map(cls => ({ label: cls, value: cls }))
              ]}
              selectedValue={selectedClass}
              onValueChange={setSelectedClass}
              style={styles.wheelPicker}
              enabled={true}
            />
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Subject</Text>
          <View style={styles.pickerContainer}>
            <CustomWheelPicker
              items={[
                { 
                  label: getSubjectPlaceholder(!!selectedClass, availableSubjects.length > 0),
                  value: '' 
                },
                ...availableSubjects.map(subject => ({ label: subject, value: subject }))
              ]}
              selectedValue={selectedSubject}
              onValueChange={setSelectedSubject}
              style={{
                ...styles.wheelPicker,
                ...(selectedClass ? {} : styles.disabledPicker)
              }}
              enabled={!!selectedClass && availableSubjects.length > 0}
            />
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Term</Text>
          <View style={styles.pickerContainer}>
            <CustomWheelPicker
              items={terms.map(term => ({ label: term, value: term }))}
              selectedValue={selectedTerm}
              onValueChange={setSelectedTerm}
              style={styles.wheelPicker}
              enabled={true}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[
                styles.button, 
                (!selectedClass || !selectedSubject) && styles.buttonDisabled
              ]} 
              onPress={handleStartAssessment}
              disabled={!selectedClass || !selectedSubject || availableSubjects.length === 0}
            >
              <Text style={styles.buttonText}>Start Assessment</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.secondaryButton,
                (!selectedClass || !selectedSubject) && styles.buttonDisabled
              ]} 
              onPress={handleViewSummary}
              disabled={!selectedClass || !selectedSubject || availableSubjects.length === 0}
            >
              <Text style={styles.buttonText}>View Summary</Text>
            </TouchableOpacity>
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 0,
  },
 
  title: {
    fontSize: 32,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.primary,
    marginBottom: 28,
    marginTop: 8,
    letterSpacing: -0.8,
  },
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  label: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.primary,
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  pickerContainer: {
    borderWidth: 3,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    padding: 8,
    height: 200,
    overflow: 'hidden',
  },
  wheelPicker: {
    width: '100%',
    height: '100%',
  } as const,
  disabledPicker: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'column',
    marginTop: 20,
    gap: 12,
  },
  button: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondaryButton: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'LeagueSpartan-Bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-SemiBold',
    color: '#111827',
    marginBottom: 16,
    marginTop: 4,
    letterSpacing: 0.2,
  },
  emptyText: {
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 24,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: 'LeagueSpartan-Regular',
  },
});

export default AssessmentDashboard;
