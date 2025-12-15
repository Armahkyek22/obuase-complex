import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionHistory, useRefreshData } from '../hooks/useQueries';
import { OfflineIndicator } from '../components/OfflineIndicator';
import { Transaction } from '../types';



const TransactionHistoryScreen = ({ navigation }: any) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

  const {
    data: transactions = [],
    isLoading,
    refetch: refetchTransactions
  } = useTransactionHistory();

  // Type assertion to ensure transactions is an array
  const transactionList = Array.isArray(transactions) ? transactions : [];

  const { refreshAll } = useRefreshData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshAll();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTransactions = transactionList.filter((transaction: Transaction) => {
    if (selectedFilter === 'all') return true;
    return transaction.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      case 'cancelled':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'failed':
        return 'close-circle';
      case 'cancelled':
        return 'ban';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFilterCount = (filter: string) => {
    if (filter === 'all') return transactionList.length;
    return transactionList.filter((t: Transaction) => t.status === filter).length;
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F9FA']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={styles.placeholder} />
      </View>

      <OfflineIndicator />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {[
            { key: 'all', label: 'All' },
            { key: 'completed', label: 'Completed' },
            { key: 'pending', label: 'Pending' },
            { key: 'failed', label: 'Failed' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                selectedFilter === filter.key && styles.activeFilterTab
              ]}
              onPress={() => setSelectedFilter(filter.key as any)}
            >
              <Text style={[
                styles.filterTabText,
                selectedFilter === filter.key && styles.activeFilterTabText
              ]}>
                {filter.label} ({getFilterCount(filter.key)})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : filteredTransactions.length > 0 ? (
          <View style={styles.transactionsContainer}>
            {filteredTransactions.map((transaction: Transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                activeOpacity={0.7}
              >
                <View style={styles.transactionContent}>
                  <View style={styles.transactionLeft}>
                    <View style={[
                      styles.statusIcon,
                      { backgroundColor: getStatusColor(transaction.status) }
                    ]}>
                      <Ionicons
                        name={getStatusIcon(transaction.status)}
                        size={20}
                        color="#FFFFFF"
                      />
                    </View>

                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionDescription}>
                        {transaction.description}
                      </Text>
                      <Text style={styles.transactionDate}>
                        {formatDate(transaction.date)}
                      </Text>
                      <View style={styles.transactionMeta}>
                        <Text style={styles.paymentMethod}>
                          {transaction.paymentMethod}
                        </Text>
                        <Text style={styles.reference}>
                          Ref: {transaction.reference}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.transactionRight}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.status === 'completed' ? '#10B981' : '#333333' }
                    ]}>
                      {transaction.currency} {transaction.amount.toFixed(2)}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(transaction.status) + '20' }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: getStatusColor(transaction.status) }
                      ]}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.noTransactionsContainer}>
            <Ionicons name="receipt-outline" size={48} color="#CCCCCC" />
            <Text style={styles.noTransactionsText}>
              {selectedFilter === 'all'
                ? 'No transactions found'
                : `No ${selectedFilter} transactions`
              }
            </Text>
            <Text style={styles.noTransactionsSubtext}>
              Your payment history will appear here
            </Text>
          </View>
        )}
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  placeholder: {
    width: 32,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterTab: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  content: {
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
  transactionsContainer: {
    paddingBottom: 30,
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 6,
  },
  transactionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  paymentMethod: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '500',
  },
  reference: {
    fontSize: 12,
    color: '#999999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noTransactionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  noTransactionsText: {
    fontSize: 18,
    color: '#999999',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  noTransactionsSubtext: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TransactionHistoryScreen;