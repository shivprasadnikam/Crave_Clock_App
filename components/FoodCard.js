import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../styles/globalStyles';

const FoodCard = ({ food, onAddToCart, onUpdateQuantity, quantityInCart = 0, loading = false }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(food, 1);
    }
  };

  const handleIncrement = () => {
    if (onUpdateQuantity) {
      onUpdateQuantity(food, quantityInCart + 1);
    }
  };

  const handleDecrement = () => {
    if (onUpdateQuantity) {
      onUpdateQuantity(food, quantityInCart - 1);
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: food.image || 'https://via.placeholder.com/150x150' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{food.itemName}</Text>
        <Text style={styles.description}>{food.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₹{food.price}</Text>
          {quantityInCart > 0 ? (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[styles.quantityButton, loading && styles.disabledButton]}
                onPress={handleDecrement}
                disabled={loading}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantityInCart}</Text>
              <TouchableOpacity
                style={[styles.quantityButton, loading && styles.disabledButton]}
                onPress={handleIncrement}
                disabled={loading}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.addButton, loading && styles.disabledButton]}
              onPress={handleAddToCart}
              disabled={loading}
            >
              <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
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
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: colors.gray,
    marginBottom: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  quantityButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginHorizontal: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default FoodCard;