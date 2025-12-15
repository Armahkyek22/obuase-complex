import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useChild } from '../contexts/ChildContext';
import { useGrades, useRefreshData, useResultsForPeriod } from '../hooks/useQueries';
import { OfflineIndicator } from '../components/OfflineIndicator';

const ResultsScreen = ({ navigation, route }: any) => {
  const { selectedChild, setSelectedChild, children } = useChild();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Check if we're viewing a specific period's results
  const periodId = route?.params?.periodId;
  const periodTitle = route?.params?.title;
  
  const { 
    data: gradesData = [], 
    isLoading: isLoadingGrades, 
    refetch: refetchGrades 
  } = useGrades(selectedChild?.id || '');
  
  const {
    data: periodResults = [],
    isLoading: isLoadingPeriodResults,
    refetch: refetchPeriodResults
  } = useResultsForPeriod(periodId || '');
  
  const { refreshGrades } = useRefreshData();

  // Use period results if available, otherwise use current grades
  const displayData = periodId ? periodResults : gradesData;
  const isLoading = periodId ? isLoadingPeriodResults : isLoadingGrades;
  
  // Type assertion to ensure displayData is an array
  const grades = Array.isArray(displayData) ? displayData : [];

  const getPerformanceFromGrade = (grade: string): string => {
    if (grade.includes('A')) return 'Excellent';
    if (grade.includes('B')) return 'Good';
    if (grade.includes('C')) return 'Average';
    return 'Needs Improvement';
  };

  const handleRefresh = async () => {
    if (!selectedChild) return;
    
    setIsRefreshing(true);
    try {
      await refreshGrades(selectedChild.id);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'Excellent': return '#10B981';
      case 'Good': return '#3B82F6';
      case 'Average': return '#F59E0B';
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
        {periodId && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {periodTitle || 'Results'}
        </Text>
        {!periodId && (
          <TouchableOpacity 
            style={styles.listButton}
            onPress={() => navigation.navigate('ResultsList')}
          >
            <Ionicons name="list" size={24} color="#333333" />
          </TouchableOpacity>
        )}
      </View>

      {/* Child Tabs - only show if not viewing specific period */}
      {!periodId && children.length > 0 && (
        <View style={styles.childTabsContainer}>
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
        </View>
      )}

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
            <Text style={styles.loadingText}>Loading grades...</Text>
          </View>
        ) : !selectedChild ? (
          <View style={styles.noChildContainer}>
            <Text style={styles.noChildText}>Please select a child to view results</Text>
          </View>
        ) : (
          <>
        {/* Terminal Result Header */}
        <View style={styles.terminalHeader}>
          <Text style={styles.terminalText}>TERMINAL RESULT</Text>
        </View>

        {/* Subject Results */}
        <View style={styles.resultsContainer}>
          {grades.map((gradeData: any, index: number) => (
            <View key={index} style={styles.subjectCard}>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectName}>{gradeData.subject}</Text>
                <Text style={styles.subjectGrade}>{gradeData.currentGrade}</Text>
              </View>
              <View style={styles.scoreInfo}>
                <Text style={styles.scoreNumber}>
                  {gradeData.records.length > 0 
                    ? Math.round(gradeData.records.reduce((sum: number, record: any) => sum + (record.score / record.maxScore * 100), 0) / gradeData.records.length)
                    : 0
                  }
                </Text>
                <Text style={[styles.performanceText, { color: getPerformanceColor(getPerformanceFromGrade(gradeData.currentGrade)) }]}>
                  {getPerformanceFromGrade(gradeData.currentGrade)}
                </Text>
              </View>
            </View>
          ))}
        </View>
        </>
        )}

        {/* Mock Result Dropdown */}
        <TouchableOpacity style={styles.mockResultButton}>
          <Text style={styles.mockResultText}>MOCK RESULT</Text>
          <Ionicons name="chevron-down" size={20} color="#3B82F6" />
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 4,
  },
  listButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    flex: 1,
  },
  childTabsContainer: {
    paddingHorizontal: 20,
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
  terminalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  terminalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    letterSpacing: 1,
  },
  resultsContainer: {
    marginBottom: 30,
  },
  subjectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  subjectGrade: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  scoreInfo: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  performanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  mockResultButton: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  mockResultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 8,
    letterSpacing: 1,
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

export default ResultsScreen;