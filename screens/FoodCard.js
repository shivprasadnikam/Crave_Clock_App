import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../styles/globalStyles';

const FoodCard = ({ 
  food, 
  onAddToCart, 
  onUpdateQuantity, 
  quantityInCart = 0, 
  loading = false 
}) => {
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
        source={{ uri: food.image || 'https://via.placeholder.com/80x80' }}
        style={styles.image}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {food.itemName}
          </Text>
          {food.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{food.category}</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {food.description || 'Delicious food item'}
        </Text>
        
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
              <Text style={styles.addButtonText}>
                {loading ? 'Adding...' : 'Add'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#1976D2',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
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
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default FoodCard;