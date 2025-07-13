import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';

const CartScreen = ({ navigation }) => {
  const { cart, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const renderCartItem = ({ item }) => (
    <CartItem item={item} />
  );

  if (cart.length === 0) {
    return (
      <View style={[globalStyles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={globalStyles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={globalStyles.buttonText}>Browse Restaurants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.title, styles.title]}>Your Cart</Text>
      
      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.menuId.toString()}
        style={styles.list}
      />
      
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ${getCartTotal().toFixed(2)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[globalStyles.button, styles.clearButton]}
            onPress={handleClearCart}
          >
            <Text style={globalStyles.buttonText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[globalStyles.button, styles.checkoutButton]}
            onPress={handleCheckout}
          >
            <Text style={globalStyles.buttonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: colors.gray,
    marginBottom: 24,
  },
  footer: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  checkoutButton: {
    flex: 2,
  },
});

export default CartScreen;