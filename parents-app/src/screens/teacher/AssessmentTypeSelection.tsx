import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const assessmentTypes = [
  { id: 'test1', name: 'Test 1', status: 'Open' },
  { id: 'test2', name: 'Test 2', status: 'Open' },
  { id: 'project', name: 'Project Work', status: 'Open' },
  { id: 'group', name: 'Group Work', status: 'Open' },
  { id: 'exam', name: 'Examination', status: 'Open' },
];

const AssessmentTypeSelection = () => {
  type AssessmentTypeScreenParams = {
    class: string;
    subject: string;
    term: string;
    studentId: string;
    studentName: string;
  };
  
  type AssessmentTypeScreenRouteProp = RouteProp<{ params: AssessmentTypeScreenParams }, 'params'>;
  
  const navigation = useNavigation<any>();
  const route = useRoute<AssessmentTypeScreenRouteProp>();
  const { class: selectedClass, subject, term, studentId, studentName } = route.params;

  const handleSelectAssessment = (type: string) => {
    navigation.navigate('EnterScores', {
      class: selectedClass,
      subject,
      term,
      assessmentType: type,
      studentId,
      studentName,
      maxScore: 100, // Default max score, adjust as needed
      score: '',
      remarks: ''
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Assessment Type</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.classInfo}>
            {selectedClass} • {subject} • {term}
          </Text>
          <Text style={styles.studentInfo}>
            Student: {studentName}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Available Assessments</Text>
        
        {assessmentTypes.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.assessmentItem}
            onPress={() => handleSelectAssessment(item.id)}
          >
            <View style={styles.assessmentInfo}>
              <Text style={styles.assessmentName}>{item.name}</Text>
              <View style={[styles.statusBadge, item.status === 'Open' ? styles.statusOpen : styles.statusClosed]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  classInfo: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 4,
  },
  studentInfo: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  assessmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  assessmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assessmentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#ECFDF5',
  },
  statusClosed: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default AssessmentTypeSelection;
