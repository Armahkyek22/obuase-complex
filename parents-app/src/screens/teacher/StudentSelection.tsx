import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AssessmentStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';

// Mock data - replace with actual data from your API
const mockStudents = [
  { 
    id: '1', 
    name: 'John Doe', 
    admissionNumber: 'STD001',
    assessments: {
      test1: true,
      test2: false,
      project: true,
      group: false,
      exam: false
    }
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    admissionNumber: 'STD002',
    assessments: {
      test1: true,
      test2: true,
      project: true,
      group: true,
      exam: false
    }
  },
  { 
    id: '3', 
    name: 'Michael Johnson', 
    admissionNumber: 'STD003',
    assessments: {
      test1: false,
      test2: false,
      project: false,
      group: false,
      exam: false
    }
  },
  { 
    id: '4', 
    name: 'Sarah Williams', 
    admissionNumber: 'STD004',
    assessments: {
      test1: true,
      test2: true,
      project: false,
      group: true,
      exam: false
    }
  },
  { 
    id: '5', 
    name: 'David Brown', 
    admissionNumber: 'STD005',
    assessments: {
      test1: true,
      test2: true,
      project: true,
      group: true,
      exam: true
    }
  },
];

const StudentSelection = () => {
  type StudentSelectionParams = {
    class: string;
    subject: string;
    term: string;
  };
  
  type StudentSelectionRouteProp = RouteProp<{ params: StudentSelectionParams }, 'params'>;
  
  const navigation = useNavigation<StackNavigationProp<AssessmentStackParamList, 'StudentSelection'>>();
  const route = useRoute<StudentSelectionRouteProp>();
  const { class: selectedClass, subject, term } = route.params;
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId);
    const student = mockStudents.find(s => s.id === studentId);
    if (student) {
      navigation.navigate('EnterScores', {
        class: selectedClass,
        subject,
        term,
        assessmentType: 'test1', // Default to test1, you can make this configurable if needed
        studentId: student.id,
        studentName: student.name,
        score: '',
        remarks: '',
        maxScore: 20 // Default max score, adjust as needed
      });
    }
  };

  const renderAssessmentDots = (assessments: Record<string, boolean>) => {
    const assessmentTypes = ['test1', 'test2', 'project', 'group', 'exam'];
    return (
      <View style={styles.assessmentsContainer}>
        {assessmentTypes.map((type, index) => (
          <View 
            key={type}
            style={[
              styles.assessmentDot,
              assessments[type] ? styles.assessmentCompleted : styles.assessmentPending
            ]}
          />
        ))}
      </View>
    );
  };

  const renderStudentItem = ({ item }: { item: typeof mockStudents[0] }) => {
    const completedCount = Object.values(item.assessments).filter(Boolean).length;

    return (
      <TouchableOpacity
        style={[
          styles.studentItem,
          selectedStudent === item.id && styles.selectedStudentItem
        ]}
        onPress={() => handleStudentSelect(item.id)}
      >
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.assessmentsCount}>
            {completedCount}
          </Text>
        </View>
        <View style={styles.assessmentInfo}>
          {renderAssessmentDots(item.assessments)}
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Student</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.classInfo}>
          {selectedClass} • {subject} • {term}
        </Text>
      </View>

      <FlatList
        data={mockStudents}
        renderItem={renderStudentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.studentList}
      />

      {/* Removed continue button as we auto-navigate on selection */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 16,
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.primary,
    letterSpacing: -0.8,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  classInfo: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan-Regular',
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  studentList: {
    padding: 16,
    paddingBottom: 80, // Space for the continue button
  },
  studentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background.light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
  },
  selectedStudentItem: {
    backgroundColor: 'rgba(138, 179, 245, 0.6)',
  },
  studentInfo: {
    flex: 1,
   
  },
  studentDetails: {
    flexDirection: 'row',
    fontSize: 24,
    fontFamily: 'LeagueSpartan-Regular',
    color: COLORS.text.primary,
    alignItems: 'center',
    marginTop: 4,
  },
  assessmentsContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },
  assessmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  assessmentCompleted: {
    backgroundColor: '#10B981', // Green for completed
  },
  assessmentPending: {
    backgroundColor: '#E5E7EB', // Gray for pending
  },
  assessmentsCount: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  studentName: {
    fontSize: 20,
    fontFamily: 'LeagueSpartan-Regular',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  assessmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  continueButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'LeagueSpartan-Bold',
  },
});

export default StudentSelection;
