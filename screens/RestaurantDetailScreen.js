import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import FoodCard from '../components/FoodCard';
import { foodAPI } from '../services/api';
import { useCart } from '../hooks/useCart.js';

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant, userId } = route.params;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use custom cart hook
  const {
    cart,
    cartLoading,
    fetchCartData,
    addToCart,
    updateCartItem,
    incrementItem,
    decrementItem,
    getItemQuantityInCart,
    getTotalAmount,
    getTotalItems
  } = useCart(userId, restaurant.vendorId);

  console.log("On RestaurantDetailScreen - Restaurant:", restaurant.vendorId, "User:", userId);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    await Promise.all([
      fetchMenu(),
      fetchCartData()
    ]);
  };

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getMenuByRestaurant(restaurant.vendorId);
      
      // Ensure all menu items have vendorId
      const menuWithVendorId = response.data.map((item) => ({
        ...item,
        vendorId: item.vendorId || restaurant.vendorId,
      }));
      
      setMenu(menuWithVendorId);
      console.log("Menu Response :: ", menuWithVendorId);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch menu');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (item, quantity = 1) => {
    console.log("handleAddToCart")
    await addToCart(item, quantity);
  };

  const handleUpdateCartItem = async (item, newQuantity) => {
    console.log("handleUpdateCartItem")
    await updateCartItem(item, newQuantity);
  };

  const handleViewCart = () => {
    navigation.navigate('CartTab', {
      screen: 'CartScreen',
      params: {
        cart: cart,
        restaurant: restaurant,
        totalAmount: getTotalAmount(),
        totalItems: getTotalItems(),
        userId: userId
      }
    });
  };

  const renderMenuItem = ({ item }) => (
    <FoodCard 
      food={item} 
      onAddToCart={handleAddToCart}
      onUpdateQuantity={handleUpdateCartItem}
      quantityInCart={getItemQuantityInCart(item)}
      loading={cartLoading}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Image
        source={{ uri: restaurant.image || 'https://via.placeholder.com/400x200' }}
        style={styles.headerImage}
      />
      <View style={styles.headerContent}>
        <Text style={globalStyles.title}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.category}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime} min</Text>
          <Text style={styles.deliveryFee}>Delivery: ₹{restaurant.deliveryFee}</Text>
        </View>
      </View>
      
      <Text style={[globalStyles.subtitle, styles.menuTitle]}>Menu</Text>
      <FlatList
        data={menu}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.menuId.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuList}
      />

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>
              {getTotalItems()} items • ₹{getTotalAmount()}
            </Text>
            {cartLoading && (
              <ActivityIndicator size="small" color={colors.primary} style={styles.cartLoader} />
            )}
          </View>
          <TouchableOpacity style={styles.viewCartButton} onPress={handleViewCart}>
            <Text style={styles.viewCartButtonText}>View Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  headerContent: {
    padding: 16,
  },
  cuisine: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: colors.darkGray,
  },
  deliveryTime: {
    fontSize: 14,
    color: colors.darkGray,
  },
  deliveryFee: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  menuTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  menuList: {
    paddingBottom: 100,
  },
  cartSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cartInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cartLoader: {
    marginLeft: 10,
  },
  viewCartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RestaurantDetailScreen;