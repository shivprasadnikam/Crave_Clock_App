import axios from 'axios';

const BASE_URL = 'http://192.168.1.4:8082';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const foodAPI = {
  // ✅ Login API
  login: (email, password) => api.post('/api/login', { email, password }),

  // Restaurants
  getAllRestaurants: () => api.get('/api/restaurants'),
  getRestaurantById: (id) => api.get(`/api/restaurants/${id}`),

  // Menu Items
  getMenuByRestaurant: (restaurantId) => api.get(`/api/restaurants/${restaurantId}/menu`),

  // Orders
  createOrder: (orderData) => api.post('/api/orders', orderData),
  getOrderHistory: (userId) => api.get(`/api/orders/user/${userId}`),
  getOrderById: (orderId) => api.get(`/api/orders/${orderId}`),

  // Categories
  getCategories: () => api.get('/api/categories'),

  // Search
  searchRestaurants: (query) => api.get(`/api/restaurants/search?q=${query}`),
  searchFood: (query) => api.get(`/api/food/search?q=${query}`),
};

export default api;
