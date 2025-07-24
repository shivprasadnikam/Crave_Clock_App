import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { useCart } from '../hooks/useCart';
import { foodAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CheckoutScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const userId = route?.params?.userId || user?.id;
  const { cart, getTotalAmount, clearCart } = useCart(userId);
  console.log('CheckoutScreen rendered');
  console.log('CheckoutScreen cart:', cart);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await foodAPI.getUserProfile(userId);
        if (res.data && res.data.phoneNumber) {
          setPhoneNumber(res.data.phoneNumber);
        }
      } catch (err) {
        // Optionally handle error
      }
    };
    fetchProfile();
  }, [userId]);

  const handlePlaceOrder = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Missing Information', 'Please fill in your phone number');
      return;
    }
    if (!cart || cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty.');
      return;
    }
    navigation.navigate('PaymentScreen', {
      amount: total, // Only subtotal + tax
      orderId: 'order_' + Date.now(),
      userName: user?.name || '',
      userId: userId,
      cart,
      phoneNumber: phoneNumber.trim(),
      specialInstructions: specialInstructions.trim(),
      tax,
      subtotal: getTotalAmount(),
    });
  };

  const tax = getTotalAmount() * 0.08;
  const total = getTotalAmount() + tax;

  if (!cart || cart.length === 0) {
    return <Text>Your cart is empty</Text>;
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={styles.container}>
        <Text style={globalStyles.title}>Checkout</Text>

        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>Contact Information</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Phone Number *"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Special Instructions (optional)"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>Order Summary</Text>
          {cart.map((item) => (
            <View key={item.cartItemId}>
              <Text>{item.itemName} x {item.quantity}</Text>
              <Text>₹{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={globalStyles.subtitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal:</Text>
            <Text style={styles.summaryText}>₹{getTotalAmount().toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tax:</Text>
            <Text style={styles.summaryText}>₹{tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalText}>₹{total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[globalStyles.button, loading && styles.disabledButton]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Placing Order...' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemName: {
    fontSize: 16,
    color: colors.black,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryText: {
    fontSize: 16,
    color: colors.darkGray,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 8,
    paddingTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CheckoutScreen;