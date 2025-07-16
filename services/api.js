import axios from 'axios';

const BASE_URL = 'http://192.168.1.5:8082';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const foodAPI = {
  // ✅ Login API
  loginUser: (email, password) => api.post('/api/login', { email, password }),

  // 🍽️ Restaurants
  getAllRestaurants: () => api.get('/api/restaurants'),
  getRestaurantById: (id) => api.get(`/api/restaurants/${id}`),

  // 📋 Menu Items - Fixed method name
  getRestaurantMenu: (restaurantId) => api.get(`/api/restaurants/${restaurantId}/menu`),
  getMenuByRestaurant: (restaurantId) => api.get(`/api/restaurants/${restaurantId}/menu`),

  // 📦 Orders
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getOrderHistory: (userId) => api.get(`/api/orders/user/${userId}`),
  getOrderById: (orderId) => api.get(`/api/orders/${orderId}`),

  // 🧾 Categories
  getCategories: () => api.get('/api/categories'),

  // 🔍 Search
  searchRestaurants: (query) => api.get(`/api/restaurants/search?q=${query}`),
  searchFood: (query) => api.get(`/api/food/search?q=${query}`),

  // 🛒 Cart - Enhanced cart operations
  addToCart: (cartData) => api.post('/api/cart/add', cartData),
  getCartByUserId: (userId) => api.get(`/api/cart/${userId}`),
  updateCartItem: (userId, cartItemId, quantity) => 
    api.put(`/api/cart/${userId}/${cartItemId}`, { quantity }),
  removeCartItem: (userId, cartItemId) => 
    api.delete(`/api/cart/${userId}/${cartItemId}`),
  clearCart: (userId) => api.delete(`/api/cart/${userId}`),
  
  // Sync cart with backend
  syncCart: (userId, cartItems) => api.post(`/api/cart/sync/${userId}`, { items: cartItems }),
};

export default api;