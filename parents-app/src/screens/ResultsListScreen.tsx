import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useChild } from '../contexts/ChildContext';
import { useResultPeriods, useRefreshData } from '../hooks/useQueries';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { ResultPeriod } from '../types';

const ResultsListScreen = ({ navigation }: any) => {
  const { selectedChild, setSelectedChild, children } = useChild();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const { 
    data: resultPeriods = [], 
    isLoading, 
    refetch: refetchResults 
  } = useResultPeriods(selectedChild?.id || '');
  
  // Type assertion to ensure resultPeriods is an array
  const periods = Array.isArray(resultPeriods) ? resultPeriods : [];
  
  const { refreshAll } = useRefreshData();

  const handleRefresh = async () => {
    if (!selectedChild) return;
    
    setIsRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handlePeriodPress = (period: ResultPeriod) => {
    if (period.isPaid) {
      // Navigate to results with the period data
      navigation.navigate('Results', { 
        periodId: period.id,
        childId: period.childId,
        title: period.title 
      });
    } else {
      // Navigate to payment screen
      navigation.navigate('Payment', { 
        periodId: period.id,
        childId: period.childId,
        amount: period.price,
        currency: period.currency,
        title: period.title 
      });
    }
  };

  const getResultTypeColor = (type: 'terminal' | 'mock') => {
    return type === 'terminal' ? '#DC2626' : '#F59E0B';
  };

  const getResultTypeIcon = (type: 'terminal' | 'mock') => {
    return type === 'terminal' ? 'document-text' : 'document-outline';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <LinearGradient
      colors={['#DC2626', '#B91C1C']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Results</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <OfflineIndicator />

      {/* Content */}
      <View style={styles.contentContainer}>
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

        {/* Select Semester Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.selectTitle}>Select a semester</Text>
        </View>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={['#DC2626']}
              tintColor="#DC2626"
            />
          }
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#DC2626" />
              <Text style={styles.loadingText}>Loading results...</Text>
            </View>
          ) : !selectedChild ? (
            <View style={styles.noChildContainer}>
              <Text style={styles.noChildText}>Please select a child to view results</Text>
            </View>
          ) : periods.length > 0 ? (
            <View style={styles.periodsContainer}>
              {periods.map((period: ResultPeriod) => (
                <TouchableOpacity
                  key={period.id}
                  style={styles.periodCard}
                  onPress={() => handlePeriodPress(period)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.periodIndicator, { backgroundColor: getResultTypeColor(period.type) }]} />
                  
                  <View style={styles.periodContent}>
                    <View style={styles.periodHeader}>
                      <View style={styles.periodTitleContainer}>
                        <Text style={styles.periodTitle}>{period.title}</Text>
                        <View style={styles.periodMeta}>
                          <Ionicons 
                            name={getResultTypeIcon(period.type)} 
                            size={14} 
                            color="#666666" 
                          />
                          <Text style={styles.periodType}>
                            {period.type === 'terminal' ? 'Terminal' : 'Mock'} Results
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.periodRight}>
                        {period.isPaid ? (
                          <View style={styles.paidBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text style={styles.paidText}>Paid</Text>
                          </View>
                        ) : (
                          <View style={styles.priceContainer}>
                            <Text style={styles.priceText}>
                              {period.currency} {period.price.toFixed(2)}
                            </Text>
                            <Ionicons name="lock-closed" size={16} color="#EF4444" />
                          </View>
                        )}
                      </View>
                    </View>

                    <Text style={styles.academicYear}>{period.academicYear}</Text>
                    
                    <View style={styles.periodFooter}>
                      <Text style={styles.publishedDate}>
                        Published: {formatDate(period.publishedDate)}
                      </Text>
                      <Ionicons 
                        name="chevron-forward" 
                        size={16} 
                        color="#999999" 
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="document-outline" size={48} color="#CCCCCC" />
              <Text style={styles.noResultsText}>No results available</Text>
              <Text style={styles.noResultsSubtext}>
                Results will appear here when published by your school
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  childTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  childTab: {
    paddingBottom: 8,
  },
  activeChildTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC2626',
  },
  childTabText: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '500',
  },
  activeChildTabText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  selectTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B4513',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
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
  periodsContainer: {
    paddingBottom: 30,
  },
  periodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  periodIndicator: {
    width: 4,
    backgroundColor: '#DC2626',
  },
  periodContent: {
    flex: 1,
    padding: 16,
  },
  periodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  periodTitleContainer: {
    flex: 1,
  },
  periodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  periodMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  periodType: {
    fontSize: 12,
    color: '#666666',
  },
  periodRight: {
    alignItems: 'flex-end',
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paidText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  academicYear: {
    fontSize: 32,
    fontWeight: '300',
    color: '#E5E7EB',
    marginBottom: 8,
  },
  periodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  publishedDate: {
    fontSize: 12,
    color: '#999999',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    color: '#999999',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ResultsListScreen;