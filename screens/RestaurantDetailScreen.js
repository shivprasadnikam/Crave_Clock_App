import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import FoodCard from '../components/FoodCard';
import { foodAPI } from '../services/api';

const RestaurantDetailScreen = ({ route }) => {
  const { restaurant } = route.params;
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log("On RestaurantDetailScreen")
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await foodAPI.getMenuByRestaurant(restaurant.vendorId);
      setMenu(response.data);
      console.log("Menu Response :: ",response.data)
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch menu');
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMenuItem = ({ item }) => (
    <FoodCard food={item} />
  );

  return (
    <View style={globalStyles.container}>
      <Image
        source={{ uri: restaurant.image || 'https://via.placeholder.com/400x200' }}
        style={styles.headerImage}
      />
      <View style={styles.headerContent}>
        <Text style={globalStyles.title}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default RestaurantDetailScreen;