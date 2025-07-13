import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { foodAPI } from '../services/api';

const RestaurantDetailScreen = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("On RestaurantDetailScreen");
    fetchMenuItems();
  }, []);

const fetchMenuItems = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await foodAPI.getRestaurantMenu(restaurant.vendorId);
    console.log("Menu data:", response.data);

    const menuWithKeys = response.data.map((item) => ({
      ...item,
      uniqueKey: `${restaurant.vendorId}-${item.menuId}`, // strong unique key
    }));

    setMenuItems(menuWithKeys);
  } catch (err) {
    console.error('Error fetching menu:', err);
    setError('Failed to load menu items');
    Alert.alert('Error', 'Failed to load menu items');
  } finally {
    setLoading(false);
  }
};

const handleAddToCart = (item) => {
  setCart((prevCart) => {
    const key = `${item.vendorId}-${item.menuId}`;
    const existingItem = prevCart.find((i) => `${i.vendorId}-${i.menuId}` === key);

    if (existingItem) {
      return prevCart.map((i) =>
        `${i.vendorId}-${i.menuId}` === key
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      return [...prevCart, { ...item, quantity: 1 }];
    }
  });
};

const handleIncrement = (item) => {
  setCart((prevCart) => {
    return prevCart.map((i) =>
      i.vendorId === item.vendorId && i.menuId === item.menuId
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
  });
};

const handleDecrement = (item) => {
  setCart((prevCart) =>
    prevCart
      .map((i) =>
        i.vendorId === item.vendorId && i.menuId === item.menuId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
      .filter((i) => i.quantity > 0)
  );
};



const getItemQuantityInCart = (item) => {
  const cartItem = cart.find(
    (i) => i.menuId === item.menuId && i.vendorId === item.vendorId
  );
  return cartItem ? cartItem.quantity : 0;
};


useEffect(() => {
  console.log("🛒 Cart Updated:", cart.map(c => `${c.itemName} (qty: ${c.quantity})`));
}, [cart]);


  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleViewCart = () => {
    navigation.navigate('Cart', { 
      cart: cart, 
      restaurant: restaurant,
      totalAmount: getTotalAmount(),
      totalItems: getTotalItems()
    });
  };

  const renderMenuItem = ({ item }) => {
    const quantityInCart = getItemQuantityInCart(item);

    
    // Debug log for each item render
    console.log(`Rendering item: ${item.itemName}, menuId: ${item.menuId}, quantity in cart: ${quantityInCart}`);
    
    return (
      <View style={styles.menuItem}>
        <View style={styles.menuItemHeader}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          {item.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.itemDescription}>{item.description}</Text>
        {console.log("Price", item.price)}
        <View style={styles.menuItemFooter}>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
          
          {quantityInCart > 0 ? (
            <View style={styles.quantityContainer}>
<TouchableOpacity
  style={styles.quantityButton}
  onPress={() => handleDecrement(item)}
>
  <Text style={styles.quantityButtonText}>-</Text>
</TouchableOpacity>

<Text style={styles.quantityText}>{quantityInCart}</Text>

<TouchableOpacity
  style={styles.quantityButton}
  onPress={() => handleIncrement(item)}
>
  <Text style={styles.quantityButtonText}>+</Text>
</TouchableOpacity>

            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.addButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Debug: Log cart state whenever it changes
  useEffect(() => {
    console.log("Cart state changed:", cart);
  }, [cart]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading menu</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMenuItems}>
          <Text style={styles.retryButtonText}>Retry</Text>
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
        <Text style={styles.restaurantStatus}>
          Status: {restaurant.openStatus}
        </Text>
      </View>

      {/* Menu List */}
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        // keyExtractor={(item) => item.uniqueKey} // Use unique key
        keyExtractor={(item) => item.uniqueKey}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
      />

      {/* Cart Summary Bar */}
      {cart.length > 0 && (
        <View style={styles.cartSummary}>
          <View style={styles.cartInfo}>
            <Text style={styles.cartText}>
              {getTotalItems()} items • ₹{getTotalAmount()}
            </Text>
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    marginBottom: 5,
  },
  restaurantInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  restaurantStatus: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  menuList: {
    padding: 16,
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
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  categoryText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
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
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  cartSummary: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  cartInfo: {
    flex: 1,
  },
  cartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
});

export default RestaurantDetailScreen;