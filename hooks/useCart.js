// hooks/useCart.js
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { foodAPI } from '../services/api';

export const useCart = (userId, vendorId) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCartData = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided, skipping cart fetch");
      return;
    }
    
    try {
      setCartLoading(true);
      const response = await foodAPI.getCartByUserId(userId);
      console.log("Cart data from backend:", response.data);
      
      // Filter cart items for current restaurant only
      const restaurantCartItems = response.data.filter(
        item => item.vendorId === vendorId
      );
      
      console.log("Filtered cart items for restaurant:", restaurantCartItems);
      setCart(restaurantCartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setCartLoading(false);
    }
  }, [userId, vendorId]);

  const addToCart = async (item, quantity = 1) => {
    if (!userId) {
      Alert.alert('Error', 'Please log in to add items to cart');
      return;
    }

    try {
      setCartLoading(true);
      
      // Ensure item has vendorId
      const itemVendorId = item.vendorId || vendorId;
      
      // Check if item exists in cart
      const existingItem = cart.find(
        (i) => i.menuId === item.menuId && i.vendorId === itemVendorId
      );

      if (existingItem) {
        // Update existing item
        await foodAPI.updateCartItem(userId, existingItem.cartItemId, existingItem.quantity + quantity);
        console.log("Updated existing cart item:", existingItem.cartItemId);
      } else {
        // Add new item
        const cartData = {
          userId,
          vendorId: itemVendorId,
          menuId: item.menuId,
          quantity,
          price: item.price,
          itemName: item.itemName
        };
        console.log("Adding new cart item:", cartData);
        await foodAPI.addToCart(cartData);
      }

      // Refresh cart data
      await fetchCartData();
    } catch (err) {
      console.error('Error adding to cart:', err);
      Alert.alert('Error', 'Failed to add item to cart');
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartItem = async (item, newQuantity) => {
    if (!userId) return;

    try {
      setCartLoading(true);
      
      const itemVendorId = item.vendorId || vendorId;
      const cartItem = cart.find(
        (i) => i.menuId === item.menuId && i.vendorId === itemVendorId
      );

      if (cartItem) {
        if (newQuantity > 0) {
          await foodAPI.updateCartItem(userId, cartItem.cartItemId, newQuantity);
        } else {
          await foodAPI.removeCartItem(userId, cartItem.cartItemId);
        }
        await fetchCartData();
      } else {
        console.error("Cart item not found for update");
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
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
    console.log("getItemQuantity")
    const itemVendorId = item.vendorId || vendorId;
    const cartItem = cart.find(
      (i) => i.menuId === item.menuId && i.vendorId === itemVendorId
    );
    return cartItem ? cartItem.quantity : 0;
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
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