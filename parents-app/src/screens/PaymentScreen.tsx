import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { usePaymentMethods, useInitiatePayment } from '../hooks/useQueries';
import { PaymentMethod, PaymentRequest } from '../types';



const PaymentScreen = ({ navigation, route }: any) => {
  const { periodId, childId, amount, currency, title } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: paymentMethods = [], isLoading } = usePaymentMethods();
  
  // Type assertion to ensure paymentMethods is an array
  const methods = Array.isArray(paymentMethods) ? paymentMethods : [];
  const initiatePaymentMutation = useInitiatePayment();

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleProceedToPayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    setIsProcessing(true);
    
    try {
      const result = await initiatePaymentMutation.mutateAsync({
        resultPeriodId: periodId,
        paymentMethodId: selectedPaymentMethod,
        amount,
        currency,
      });

      // In a real app, this would redirect to the payment provider
      Alert.alert(
        'Payment Initiated',
        `Transaction ID: ${result.transactionId}\n\nIn a real app, you would be redirected to complete the payment.`,
        [
          {
            text: 'Simulate Success',
            onPress: () => {
              Alert.alert(
                'Payment Successful!',
                'Your payment has been processed successfully. You can now access the results.',
                [
                  {
                    text: 'View Results',
                    onPress: () => {
                      navigation.replace('Results', {
                        periodId,
                        childId,
                        title,
                      });
                    },
                  },
                ]
              );
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Payment Failed', error instanceof Error ? error.message : 'Payment could not be processed');
    } finally {
      setIsProcessing(false);
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return 'phone-portrait';
      case 'card':
        return 'card';
      case 'bank_transfer':
        return 'business';
      default:
        return 'wallet';
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case 'mobile_money':
        return '#10B981';
      case 'card':
        return '#3B82F6';
      case 'bank_transfer':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
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
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="document-text" size={24} color="#DC2626" />
            <Text style={styles.summaryTitle}>Payment Summary</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Item</Text>
            <Text style={styles.summaryValue}>{title}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryAmount}>{currency} {amount.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>{currency} {amount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading payment methods...</Text>
            </View>
          ) : (
            <View style={styles.paymentMethods}>
              {methods.map((method: PaymentMethod) => (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    selectedPaymentMethod === method.id && styles.selectedPaymentMethod
                  ]}
                  onPress={() => handlePaymentMethodSelect(method.id)}
                >
                  <View style={styles.paymentMethodContent}>
                    <View style={styles.paymentMethodLeft}>
                      <View style={[
                        styles.paymentMethodIcon,
                        { backgroundColor: getPaymentMethodColor(method.type) }
                      ]}>
                        <Ionicons 
                          name={getPaymentMethodIcon(method.type)} 
                          size={20} 
                          color="#FFFFFF" 
                        />
                      </View>
                      <View style={styles.paymentMethodInfo}>
                        <Text style={styles.paymentMethodName}>{method.name}</Text>
                        <Text style={styles.paymentMethodDetails}>{method.details}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.paymentMethodRight}>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultText}>Default</Text>
                        </View>
                      )}
                      <View style={[
                        styles.radioButton,
                        selectedPaymentMethod === method.id && styles.radioButtonSelected
                      ]}>
                        {selectedPaymentMethod === method.id && (
                          <View style={styles.radioButtonInner} />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          <Text style={styles.securityText}>
            Your payment is secured with 256-bit SSL encryption
          </Text>
        </View>
      </ScrollView>

      {/* Payment Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.payButton,
            (!selectedPaymentMethod || isProcessing) && styles.payButtonDisabled
          ]}
          onPress={handleProceedToPayment}
          disabled={!selectedPaymentMethod || isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.payButtonText}>Processing...</Text>
            </View>
          ) : (
            <Text style={styles.payButtonText}>
              Pay {currency} {amount.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
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
    color: '#333333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  summaryAmount: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  paymentMethods: {
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedPaymentMethod: {
    borderColor: '#3B82F6',
    backgroundColor: '#F0F9FF',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  paymentMethodDetails: {
    fontSize: 12,
    color: '#666666',
  },
  paymentMethodRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  defaultBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  payButton: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default PaymentScreen;