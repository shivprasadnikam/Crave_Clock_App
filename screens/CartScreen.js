import React, { useEffect } from 'react';
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
import { useCart } from '../hooks/useCart';
import { foodAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';


const CartScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const userId = route?.params?.userId || user?.id;
  const restaurant = route?.params?.restaurant;
  const vendorId = restaurant?.vendorId;

  if (!userId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cart is only available for logged-in users. Please log in first.</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={{ color: 'blue', marginTop: 20 }}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // useCart will fetch the cart for you
  const { cart, getTotalAmount, clearCart, updateCartItem, incrementItem, decrementItem, cartLoading } = useCart(userId);

  // Optionally, you can manually fetch and log for debugging:
  useEffect(() => {
    if (userId) {
      foodAPI.getCartByUserId(userId)
        .then(res => console.log('Cart response:', res.data))
        .catch(err => console.error('Cart fetch error:', err));
    }
  }, [userId]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    console.log('CartScreen handleCheckout userId:', userId);
    console.log('CartScreen handleCheckout cart:', cart);
    navigation.navigate('CartTab', {
      screen: 'Checkout',
      params: { userId }
    });
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
    <CartItem
      item={item}
      updateCartItem={updateCartItem}
      incrementItem={incrementItem}
      decrementItem={decrementItem}
      cartLoading={cartLoading}
    />
  );

  console.log('CartScreen cart:', cart);

  if (cartLoading) {
    return <Text>Loading...</Text>;
  }

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
          <Text style={styles.totalText}>Total: ₹{getTotalAmount().toFixed(2)}</Text>
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