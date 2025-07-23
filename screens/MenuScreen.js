import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { foodAPI } from '../services/api';
import { useCart } from '../hooks/useCart.js';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MenuScreen = ({ route, navigation }) => {
  const { restaurant, userId } = route.params;
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Use custom cart hook
  const {
    cart,
    cartLoading,
    fetchCartData,
    addToCart,
    incrementItem,
    decrementItem,
    getItemQuantityInCart,
    getTotalAmount,
    getTotalItems
  } = useCart(userId, restaurant.vendorId);

  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, [fetchCartData])
  );

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      await Promise.all([
        fetchMenuItems(),
        fetchCartData()
      ]);
    } catch (err) {
      console.error('Error initializing screen:', err);
    }
  };

  const fetchMenuItems = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError(null);

      const response = await foodAPI.getMenuByRestaurant(restaurant.vendorId);

      // Validate response data
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid menu data received');
      }

      // Ensure all menu items have required fields with proper validation
      const menuWithVendorId = response.data.map((item) => ({
        ...item,
        vendorId: item.vendorId || restaurant.vendorId,
        uniqueKey: `${restaurant.vendorId}-${item.menuId}`,
        price: Number(item.price) || 0,
        isAvailable: item.isAvailable === 'Y' || item.isAvailable === true,
        category: item.category || 'Others',
        description: item.description || item.itemName || 'No description available',
      }));

      setMenuItems(menuWithVendorId);
    } catch (err) {
      console.error('Error fetching menu:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load menu items';
      setError(errorMessage);
      
      // Show alert only if not refreshing
      if (showLoader) {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMenuItems(false);
  }, []);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const uniqueCategories = ['All', ...new Set(menuItems.map(item => item.category))];
    return uniqueCategories;
  }, [menuItems]);

  // Filter items based on selected category
  const filteredMenuItems = useMemo(() => {
    if (selectedCategory === 'All') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  const handleAddToCart = async (item) => {
    if (!item.isAvailable) {
      Alert.alert('Unavailable', 'This item is currently not available');
      return;
    }
    
    try {
      await addToCart(item, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleIncrement = async (item) => {
    try {
      await incrementItem(item);
    } catch (error) {
      console.error('Error incrementing item:', error);
      Alert.alert('Error', 'Failed to update cart');
    }
  };

  const handleDecrement = async (item) => {
    try {
      await decrementItem(item);
    } catch (error) {
      console.error('Error decrementing item:', error);
      Alert.alert('Error', 'Failed to update cart');
    }
  };

  const handleViewCart = () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty');
      return;
    }

    navigation.navigate('CartTab', {
      screen: 'Cart',
      params: { userId }
    });
  };

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilterContainer}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === item && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(item)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === item && styles.selectedCategoryButtonText
            ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.categoryList}
      />
    </View>
  );

  const renderMenuItem = ({ item }) => {
    const quantityInCart = getItemQuantityInCart(item);
    const isItemLoading = cartLoading; // You might want to track individual item loading
    
    return (
      <View style={[
        styles.menuItem,
        !item.isAvailable && styles.unavailableItem
      ]}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <View style={styles.badgeContainer}>
            {item.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
            )}
            <View style={[
              styles.availabilityBadge,
              item.isAvailable ? styles.availableBadge : styles.unavailableBadge
            ]}>
              <Text style={[
                styles.availabilityText,
                item.isAvailable ? styles.availableText : styles.unavailableText
              ]}>
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.itemDescription} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        
        <View style={styles.menuItemFooter}>
          <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
          
          {item.isAvailable ? (
            quantityInCart > 0 ? (
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[styles.quantityButton, isItemLoading && styles.disabledButton]}
                  onPress={() => handleDecrement(item)}
                  disabled={isItemLoading}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.quantityText}>{quantityInCart}</Text>

                <TouchableOpacity
                  style={[styles.quantityButton, isItemLoading && styles.disabledButton]}
                  onPress={() => handleIncrement(item)}
                  disabled={isItemLoading}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.addButton, isItemLoading && styles.disabledButton]}
                onPress={() => handleAddToCart(item)}
                disabled={isItemLoading}
              >
                <Text style={styles.addButtonText}>
                  {isItemLoading ? 'Adding...' : 'Add to Cart'}
                </Text>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.unavailableButton}>
              <Text style={styles.unavailableButtonText}>Not Available</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>😕</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchMenuItems()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Restaurant Header */}
      <View style={styles.restaurantHeader}>
        <Text style={styles.restaurantName}>{restaurant.name}</Text>
        <Text style={styles.restaurantInfo}>{restaurant.city}, {restaurant.state}</Text>
        <View style={styles.restaurantStatusContainer}>
          <View style={[
            styles.statusIndicator,
            restaurant.openStatus === 'Open' ? styles.openIndicator : styles.closedIndicator
          ]} />
          <Text style={[
            styles.restaurantStatus,
            restaurant.openStatus === 'Open' ? styles.openStatus : styles.closedStatus
          ]}>
            {restaurant.openStatus || 'Unknown'}
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      {categories.length > 1 && renderCategoryFilter()}

      {/* Menu List */}
      <FlatList
        data={filteredMenuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.uniqueKey}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items available</Text>
          </View>
        }
      />

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>
              {getTotalItems()} item{getTotalItems() > 1 ? 's' : ''} • ₹{getTotalAmount().toFixed(2)}
            </Text>
            {cartLoading && (
              <ActivityIndicator size="small" color="#007AFF" style={styles.cartLoader} />
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
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantHeader: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restaurantInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  restaurantStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  openIndicator: {
    backgroundColor: '#4CAF50',
  },
  closedIndicator: {
    backgroundColor: '#FF5722',
  },
  restaurantStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  openStatus: {
    color: '#4CAF50',
  },
  closedStatus: {
    color: '#FF5722',
  },
  categoryFilterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryList: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#007AFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  menuList: {
    padding: 16,
    paddingBottom: 120,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unavailableItem: {
    opacity: 0.7,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableBadge: {
    backgroundColor: '#E8F5E8',
  },
  unavailableBadge: {
    backgroundColor: '#FFEBEE',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#4CAF50',
  },
  unavailableText: {
    color: '#F44336',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  unavailableButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  unavailableButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
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
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  viewCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default MenuScreen;