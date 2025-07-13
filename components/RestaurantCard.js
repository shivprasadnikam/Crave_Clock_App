import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

const RestaurantCard = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: restaurant.image || 'https://via.placeholder.com/300x200' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
        <View style={styles.info}>
          <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
          <Text style={styles.deliveryTime}>{restaurant.deliveryTime} min</Text>
          <Text style={styles.deliveryFee}>${restaurant.deliveryFee}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  cuisine: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
  },
  info: {
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
});

export default RestaurantCard;