import axios from 'axios';
import { useEffect } from 'react';

const BASE_URL = 'http://192.168.1.4:8082';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('[API REQUEST]', config.method?.toUpperCase(), config.url, 'Data:', config.data || config.params || 'N/A');
    return config;
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// Axios response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log('[API RESPONSE]', response.config.method?.toUpperCase(), response.config.url, 'Status:', response.status, 'Data:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('[API RESPONSE ERROR]', error.config.method?.toUpperCase(), error.config.url, 'Status:', error.response.status, 'Data:', error.response.data);
    } else {
      console.error('[API NETWORK ERROR]', error.message);
    }
    return Promise.reject(error);
  }
);

export const foodAPI = {
  // ✅ Login API
  loginUser: (email, password) => {
    console.log('[foodAPI] loginUser payload:', { email, password });
    return api.post('/api/login', { email, password });
  },

  // 🍽️ Restaurants
  getAllRestaurants: () => {
    console.log('[foodAPI] getAllRestaurants');
    return api.get('/api/restaurants');
  },
  getRestaurantById: (id) => {
    console.log('[foodAPI] getRestaurantById id:', id);
    return api.get(`/api/restaurants/${id}`);
  },

  // 📋 Menu Items - Fixed method name
  getRestaurantMenu: (restaurantId) => {
    console.log('[foodAPI] getRestaurantMenu restaurantId:', restaurantId);
    return api.get(`/api/restaurants/${restaurantId}/menu`);
  },
  getMenuByRestaurant: (restaurantId) => {
    console.log('[foodAPI] getMenuByRestaurant restaurantId:', restaurantId);
    return api.get(`/api/restaurants/${restaurantId}/menu`);
  },

  // 📦 Orders
  createOrder: (orderData) => {
    console.log('[foodAPI] createOrder payload:', orderData);
    return api.post('/api/orders', orderData);
  },
  getOrderHistory: (userId) => {
    console.log('[foodAPI] getOrderHistory userId:', userId);
    return api.get(`/api/orders/user/${userId}`);
  },
  getOrderById: (orderId) => {
    console.log('[foodAPI] getOrderById orderId:', orderId);
    return api.get(`/api/orders/${orderId}`);
  },

  // 🧾 Categories
  getCategories: () => {
    console.log('[foodAPI] getCategories');
    return api.get('/api/categories');
  },

  // 🔍 Search
  searchRestaurants: (query) => {
    console.log('[foodAPI] searchRestaurants query:', query);
    return api.get(`/api/restaurants/search?q=${query}`);
  },
  searchFood: (query) => {
    console.log('[foodAPI] searchFood query:', query);
    return api.get(`/api/food/search?q=${query}`);
  },

  // 🛒 Cart - Enhanced cart operations
  addToCart: (cartData) => {
    console.log('[foodAPI] addToCart payload:', cartData);
    return api.post('/api/cart/add', cartData);
  },
  getCartByUserId: (userId) => {
    console.log('[foodAPI] getCartByUserId userId:', userId);
    return api.get(`/api/cart/${userId}`);
  },
  updateCartItem: (userId, cartItemId, quantity) => {
    console.log('[foodAPI] updateCartItem userId:', userId, 'cartItemId:', cartItemId, 'quantity:', quantity);
    return api.put(`/api/cart/${userId}/${cartItemId}`, { quantity });
  },
  removeCartItem: (userId, cartItemId) => {
    console.log('[foodAPI] removeCartItem userId:', userId, 'cartItemId:', cartItemId);
    return api.delete(`/api/cart/${userId}/${cartItemId}`);
  },
  clearCart: (userId) => {
    console.log('[foodAPI] clearCart userId:', userId);
    return api.delete(`/api/cart/${userId}`);
  },
  
  // Sync cart with backend
  syncCart: (userId, cartItems) => {
    console.log('[foodAPI] syncCart userId:', userId, 'cartItems:', cartItems);
    return api.post(`/api/cart/sync/${userId}`, { items: cartItems });
  },
};

export default api;