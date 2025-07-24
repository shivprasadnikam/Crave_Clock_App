import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import { foodAPI } from '../services/api';
import { useCart } from '../hooks/useCart';

const PaymentScreen = ({ route, navigation }) => {
  const { userId, amount, cart } = route.params;
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const { clearCart } = useCart(userId);

  // Poll payment status every 3 seconds
  const pollPaymentStatus = async (paymentId, maxAttempts = 5) => {
    setPolling(true);
    let attempts = 0;
    let status = null;
    while (attempts < maxAttempts) {
      try {
        const res = await foodAPI.getPaymentStatus(paymentId);
        status = res.data;
        if (status === 'SUCCESS') {
          setPolling(false);
          return 'SUCCESS';
        }
        if (status === 'FAILED') {
          setPolling(false);
          return 'FAILED';
        }
      } catch (err) {
        // Ignore errors, try again
      }
      await new Promise((resolve) => setTimeout(resolve, 3000));
      attempts++;
    }
    setPolling(false);
    return status;
  };

  const handlePayAndPlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Initiate payment (get paymentId and upiUrl from backend)
      const paymentReq = { userId, amount, paymentMethod: 'UPI' };
      const res = await foodAPI.initiatePayment(paymentReq);
      const { paymentId, upiCollectUrl } = res.data;
      setPaymentId(paymentId);
      if (!upiCollectUrl) throw new Error('No UPI URL returned from backend');

      // 2. Open UPI app
      const supported = await Linking.canOpenURL(upiCollectUrl);
      if (supported) {
        await Linking.openURL(upiCollectUrl);
        Alert.alert('UPI App Opened', 'Complete the payment in your UPI app, then return here.');
      } else {
        throw new Error('No UPI app found on this device.');
      }

      // 3. Poll payment status
      const status = await pollPaymentStatus(paymentId);
      if (status === 'SUCCESS') {
        // 4. Place the order
        const orderRes = await foodAPI.createOrder({
          userId,
          items: cart,
          amount,
          paymentMethod: 'UPI',
          paymentId,
        });
        // 5. Clear the cart after successful order
        await clearCart();
        Alert.alert('Success', 'Order placed successfully!');
        navigation.navigate('OrderConfirmation', { orderId: orderRes.data.orderId });
      } else if (status === 'FAILED') {
        Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.');
      } else {
        Alert.alert('Payment Pending', 'Payment status could not be confirmed. Please check your UPI app or contact support.');
      }
    } catch (err) {
      Alert.alert('Error', err?.message || 'Please try again');
    } finally {
      setLoading(false);
      setPolling(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>UPI Payment</Text>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amount}>₹{amount}</Text>
        <View style={styles.upiRow}>
          <Text style={styles.upiIcon}>💸</Text>
          <Text style={styles.upiText}>Pay via UPI</Text>
        </View>
        <TouchableOpacity
          style={[styles.payButton, (loading || polling) && styles.payButtonDisabled]}
          onPress={handlePayAndPlaceOrder}
          disabled={loading || polling}
        >
          {(loading || polling) ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payButtonText}>Pay & Place Order</Text>
          )}
        </TouchableOpacity>
        {polling && <Text style={{ marginTop: 16, color: '#888', textAlign: 'center' }}>Waiting for payment confirmation...</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', elevation: 4 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  amountLabel: { fontSize: 16, color: '#888', textAlign: 'center' },
  amount: { fontSize: 32, fontWeight: 'bold', color: '#4CAF50', marginBottom: 24, textAlign: 'center' },
  upiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  upiIcon: { fontSize: 24, marginRight: 8 },
  upiText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  payButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonDisabled: { opacity: 0.6 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default PaymentScreen; 