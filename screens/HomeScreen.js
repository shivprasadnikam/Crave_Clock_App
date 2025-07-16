import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import { foodAPI } from '../services/api';
// Optional: If you have an auth context
// import { AuthContext } from '../context/AuthContext';
 
const HomeScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userId, setUserId] = useState(null);
  
  // Optional: If you have an auth context
  // const { user } = useContext(AuthContext);

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, restaurants]);

  const initializeScreen = async () => {
    try {
      // Get user ID from AsyncStorage or your auth context
      const userToken = await AsyncStorage.getItem('userToken');
      const userIdFromStorage = await AsyncStorage.getItem('userId');
      
      if (userToken && userIdFromStorage) {
        setUserId(userIdFromStorage);
      }
      
      await fetchRestaurants();
    } catch (error) {
      console.error('Error initializing screen:', error);
      Alert.alert('Error', 'Failed to initialize the screen');
    }
  };

  const filterRestaurants = () => {
    if (searchQuery.trim() === '') {
      setFilteredRestaurants(restaurants);
    } else {
      const filtered = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllRestaurants();
      
      if (response.data && Array.isArray(response.data)) {
        setRestaurants(response.data);
        setFilteredRestaurants(response.data);
        console.log('Restaurants fetched:', response.data.length);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      Alert.alert(
        'Error', 
        'Failed to fetch restaurants. Please try again.',
        [
          { text: 'Retry', onPress: () => fetchRestaurants() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    console.log("Refreshing restaurants...");
    setRefreshing(true);
    fetchRestaurants();
  };

  const handleRestaurantPress = (restaurant) => {
    console.log("Navigating to restaurant:", restaurant.name);
    
    // Since we're in TabNavigator, user is already authenticated
    // Navigate directly to restaurant detail
    navigation.navigate('RestaurantDetail', { 
      restaurant,
      userId 
    });
  };

  const handleSearch = (query) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
  };

  const renderRestaurant = ({ item }) => (
    <RestaurantCard
      restaurant={item}
      onPress={() => handleRestaurantPress(item)}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {searchQuery 
          ? `No restaurants found matching "${searchQuery}"` 
          : 'No restaurants available at the moment'}
      </Text>
      {!searchQuery && (
        <Text style={styles.emptySubText}>
          Pull down to refresh or try again later
        </Text>
      )}
    </View>
  );

  const renderLoadingComponent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#FF6B6B" />
      <Text style={styles.loadingText}>Loading restaurants...</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={globalStyles.container}>
        <SearchBar onSearch={handleSearch} />
        {renderLoadingComponent()}
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <SearchBar onSearch={handleSearch} />
      <Text style={[globalStyles.title, styles.title]}>
        {searchQuery ? `Search Results` : 'Restaurants Near You'}
      </Text>
      {searchQuery && (
        <Text style={styles.searchInfo}>
          {filteredRestaurants.length} result{filteredRestaurants.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
      )}
      <FlatList
        data={filteredRestaurants}
        renderItem={renderRestaurant}
        keyExtractor={(item) => item.vendorId?.toString() || item.id?.toString()}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#FF6B6B']} // Android
            tintColor="#FF6B6B" // iOS
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={filteredRestaurants.length === 0 ? styles.emptyList : null}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  searchInfo: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  emptyList: {
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;