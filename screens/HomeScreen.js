import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import { foodAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await foodAPI.getAllRestaurants();
      setRestaurants(response.data);
      console.log(response.data)
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch restaurants');
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
console.log("Before onRefresh")
  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };
console.log("Before handleRestaurantPress")
  const handleRestaurantPress = (restaurant) => {
    console.log("handleRestaurantPress")
    navigation.navigate('RestaurantDetail', { restaurant });
  };

  const handleSearch = (query) => {
    // Implement search functionality
    console.log('Searching for:', query);
  };

  const renderRestaurant = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantPress(item)}
    />
  );

  return (
    <View style={globalStyles.container}>
      <SearchBar onSearch={handleSearch} />
      <Text style={[globalStyles.title, styles.title]}>Restaurants Near You</Text>
      <FlatList
        data={restaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.vendorId.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
});

export default HomeScreen;