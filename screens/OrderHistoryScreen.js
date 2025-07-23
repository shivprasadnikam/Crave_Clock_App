import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { globalStyles, colors } from '../styles/globalStyles';
import { foodAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return colors.warning;
    case 'preparing':
      return colors.secondary;
    case 'delivered':
      return colors.success;
    case 'cancelled':
      return colors.error;
    default:
      return colors.gray;
  }
};

const OrderCard = ({ order }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Text style={styles.orderId}>Order #{order.orderId}</Text>
      <Text style={styles.orderDate}>
        {order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : 'Date not available'}
      </Text>
    </View>

    {/* Handle missing order items gracefully */}
    <Text style={styles.orderItems}>
      {Array.isArray(order.items)
        ? order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')
        : 'No items available'}
    </Text>

    <View style={styles.orderFooter}>
      <Text style={styles.orderTotal}>₹{order.totalAmount?.toFixed(2) || '0.00'}</Text>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(order.status) },
        ]}
      >
        <Text style={styles.statusText}>
          {order.status ? order.status : 'unknown'}
        </Text>
      </View>
    </View>
  </View>
);

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log("Order History API call for user:", userId);
      const response = await foodAPI.getOrderHistory(userId);
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch order history');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderOrder = ({ item }) => <OrderCard order={item} />;

  if (orders.length === 0 && !loading) {
    return (
      <View style={[globalStyles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No orders yet</Text>
        <Text style={styles.emptySubtext}>
          Your order history will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.title, styles.title]}>Order History</Text>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.orderId.toString()}
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
    marginTop: 16,
  },
  orderCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
  },
  orderDate: {
    fontSize: 14,
    color: colors.gray,
  },
  orderItems: {
    fontSize: 14,
    color: colors.darkGray,
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'capitalize',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: colors.gray,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default OrderHistoryScreen;
