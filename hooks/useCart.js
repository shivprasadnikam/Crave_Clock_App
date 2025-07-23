// hooks/useCart.js
import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { foodAPI } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';


export const useCart = (userId) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCartData = useCallback(async () => {
    if (!userId) {
      return;
    }
    setCartLoading(true);
    try {
      const response = await foodAPI.getCartByUserId(userId);
      setCart(response.data);
    } catch (err) {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const addToCart = async (item, quantity = 1) => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to add items to cart');
      return;
    }
    try {
      setCartLoading(true);
      const existingItem = cart.find((i) => i.menuId === item.menuId);
      if (existingItem) {
        await foodAPI.updateCartItem(userId, existingItem.cartItemId, existingItem.quantity + quantity);
      } else {
        const cartData = {
          userId,
          vendorId: item.vendorId,
          menuId: item.menuId,
          quantity,
          price: item.price,
          itemName: item.itemName
        };
        await foodAPI.addToCart(cartData);
      }
      await fetchCartData();
    } catch (err) {
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartItem = async (item, newQuantity) => {
    if (!userId) return;
    try {
      setCartLoading(true);
      const cartItem = cart.find((i) => i.menuId === item.menuId);
      if (cartItem) {
        if (newQuantity > 0) {
          await foodAPI.updateCartItem(userId, cartItem.cartItemId, newQuantity);
        } else {
          await foodAPI.removeCartItem(userId, cartItem.cartItemId);
        }
        await fetchCartData();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update cart');
    } finally {
      setCartLoading(false);
    }
  };

  const incrementItem = async (item) => {
    const currentQuantity = getItemQuantityInCart(item);
    await updateCartItem(item, currentQuantity + 1);
  };

  const decrementItem = async (item) => {
    const currentQuantity = getItemQuantityInCart(item);
    await updateCartItem(item, currentQuantity - 1);
  };

  const getItemQuantityInCart = (item) => {
    const cartItem = cart.find((i) => i.menuId === item.menuId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = async () => {
    if (!userId) return;
    try {
      setCartLoading(true);
      await foodAPI.clearCart(userId);
      setCart([]);
    } catch (err) {
      Alert.alert('Error', 'Failed to clear cart');
    } finally {
      setCartLoading(false);
    }
  };

  return {
    cart,
    cartLoading,
    fetchCartData,
    addToCart,
    updateCartItem,
    incrementItem,
    decrementItem,
    getItemQuantityInCart,
    getTotalAmount,
    getTotalItems,
    clearCart
  };
};