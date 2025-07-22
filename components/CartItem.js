import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../styles/globalStyles';

const CartItem = ({ item, updateCartItem, incrementItem, decrementItem, cartLoading }) => {
  const handleIncrease = () => {
    incrementItem(item);
  };

  const handleDecrease = () => {
    decrementItem(item);
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/80x80' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{item.itemName}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease} disabled={cartLoading}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease} disabled={cartLoading}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.totalPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
        {/* Optionally add a remove button if needed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: colors.lightGray,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: colors.black,
  },
  rightContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  removeText: {
    fontSize: 12,
    color: colors.error,
  },
});

export default CartItem;