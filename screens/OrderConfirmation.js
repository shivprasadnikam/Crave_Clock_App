import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const OrderConfirmation = ({ route, navigation }) => {
  const { orderId } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.orderIdLabel}>Order ID</Text>
        <Text style={styles.orderId}>{orderId}</Text>
        <Text style={styles.message}>Thank you for your order. Your food will be ready soon!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('OrdersTab', { screen: 'OrderHistory' })}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>View Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%', elevation: 4, alignItems: 'center' },
  successIcon: { fontSize: 48, marginBottom: 16, color: '#4CAF50' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#4CAF50', textAlign: 'center' },
  orderIdLabel: { fontSize: 16, color: '#888', marginTop: 8 },
  orderId: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  message: { fontSize: 16, color: '#555', marginBottom: 24, textAlign: 'center' },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
  },
});

export default OrderConfirmation; 