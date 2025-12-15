import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AssessmentStackParamList } from '../../navigation/types';

import { COLORS } from '../../constants/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScoreData {
  studentId: string;
  studentName: string;
  score: number;
}

const AssessmentSummaryScreen = () => {
  type AssessmentSummaryRouteProp = RouteProp<AssessmentStackParamList, 'AssessmentSummary'>;
type AssessmentSummaryNavigationProp = NativeStackNavigationProp<AssessmentStackParamList, 'AssessmentSummary'>;

const navigation = useNavigation<AssessmentSummaryNavigationProp>();
const route = useRoute<AssessmentSummaryRouteProp>();
  const { 
    class: selectedClass, 
    subject, 
    term, 
    assessmentType, 
    maxScore,
    scores 
  } = route.params as {
    class: string;
    subject: string;
    term: string;
    assessmentType: string;
    maxScore: number;
    scores: ScoreData[];
  };

  // Calculate statistics
  const calculateStatistics = (): { average: string; highest: string; lowest: string; totalStudents: number } => {
    const scoresList = scores.map(s => s.score);
    const total = scoresList.reduce((sum, score) => sum + score, 0);
    const average = scores.length > 0 ? total / scores.length : 0;
    const highest = Math.max(...scoresList);
    const lowest = scores.length > 0 ? Math.min(...scoresList) : 0;
    
    return {
      average: average.toFixed(1),
      highest: highest.toFixed(1),
      lowest: lowest.toFixed(1),
      totalStudents: scores.length,
    };
  };

  const stats = calculateStatistics();

  const getAssessmentTypeName = (type: string): string => {
    switch (type) {
      case 'test1': return 'Test 1';
      case 'test2': return 'Test 2';
      case 'project': return 'Project Work';
      case 'group': return 'Group Work';
      case 'exam': return 'Examination';
      default: return 'Assessment';
    }
  };

  const getGradeColor = (score: number, max: number): string => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return '#10B981'; // Green
    if (percentage >= 60) return '#3B82F6'; // Blue
    if (percentage >= 50) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const handleDone = (): void => {
    // Navigate back to the assessment dashboard
    navigation.navigate('AssessmentDashboard');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Assessment Summary</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.highCard]}>
            <Text style={[styles.statValue, styles.highText]}>{stats.highest}</Text>
            <Text style={[styles.statLabel, styles.highText]}>HIGH</Text>
          </View>
          
          <View style={[styles.statCard, styles.avgCard]}>
            <Text style={[styles.statValue, styles.avgText]}>{stats.average}</Text>
            <Text style={[styles.statLabel, styles.avgText]}>AVG</Text>
          </View>
          
          <View style={[styles.statCard, styles.lowCard]}>
            <Text style={[styles.statValue, styles.lowText]}>
              {Number.parseFloat(stats.lowest).toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, styles.lowText]}>LOW</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scores Breakdown</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 2 }]}>Student</Text>
            <Text style={[styles.headerCell, { textAlign: 'center' }]}>Score</Text>
            <Text style={[styles.headerCell, { textAlign: 'right' }]}>%</Text>
          </View>
          
          {scores.map((student, index) => {
            const percentage = ((student.score / maxScore) * 100).toFixed(1);
            const gradeColor = getGradeColor(Number.parseFloat(student.score.toString()), maxScore);
            
            return (
              <View 
                key={student.studentId} 
                style={[
                  styles.tableRow,
                  index % 2 === 0 && { backgroundColor: '#F9FAFB' }
                ]}
              >
                <Text style={[styles.cell, { flex: 2, color: '#111827' }]}>
                  {student.studentName}
                </Text>
                <Text style={[styles.cell, { textAlign: 'center', color: '#111827' }]}>
                  {student.score.toFixed(1)}
                </Text>
                <Text style={[styles.cell, { textAlign: 'right', color: gradeColor, fontWeight: '600' }]}>
                  {percentage}%
                </Text>
              </View>
            );
          })}
        </View>

        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Assessment Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Class:</Text>
            <Text style={styles.detailValue}>{selectedClass}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subject:</Text>
            <Text style={styles.detailValue}>{subject}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Term:</Text>
            <Text style={styles.detailValue}>{term}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Max Score:</Text>
            <Text style={styles.detailValue}>{maxScore}</Text>
          </View>
        </View>

        <View style={{marginTop: 24, marginBottom: 40}}>
          <TouchableOpacity 
            style={[styles.doneButton, {width: '100%'}]}
            onPress={handleDone}
          >
            <Text style={styles.buttonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
    paddingBottom: 0,
  },
  header: {
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan-SemiBold',
    color: '#111827',
    marginTop: -2,
  },
  headerTitles: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -40,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.primary,
    letterSpacing: -0.8,
    paddingLeft: 20,
    paddingTop: 8,
  
    lineHeight: 24,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'LeagueSpartan-Medium',
    color: '#6B7280',
    letterSpacing: -0.1,
    marginTop: 2,
    lineHeight: 18,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: COLORS.background.light,
    gap: 8,
  },
  statCard: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
    borderRadius: 8,
  },
  highCard: {
    backgroundColor: '#ECFDF5', // Light green background
  },
  avgCard: {
    backgroundColor: '#FFFBEB', // Light yellow background
  },
  lowCard: {
    backgroundColor: '#FEF2F2', // Light red background
  },
  highText: {
    color: '#065F46', // Dark green text
  },
  avgText: {
    color: '#92400E', // Dark yellow/brown text
  },
  lowText: {
    color: '#991B1B', // Dark red text
  },
  middleCard: {
    marginHorizontal: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan-Bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'LeagueSpartan-Bold',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 4,
    lineHeight: 16,
  },
  section: {
    backgroundColor: 'white',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan-Bold',
    color: COLORS.primary,
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    fontFamily: 'LeagueSpartan-Bold',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'LeagueSpartan-Bold',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'LeagueSpartan-Medium',
    color: '#111827',
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F9FAFB',
  },
  detailLabel: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-Medium',
    color: '#6B7280',
    letterSpacing: -0.1,
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'LeagueSpartan-SemiBold',
    color: '#111827',
    letterSpacing: -0.1,
  },
  footer: {
    padding: 16,
    backgroundColor: COLORS.background.light,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerButton: {
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 24,
    marginBottom: 40,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'LeagueSpartan-Bold',
    color: 'white',
  },
});

export default AssessmentSummaryScreen;
