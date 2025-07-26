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
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

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

const statusIcon = (status) => {
  switch (status) {
    case 'delivered':
      return <MaterialIcons name="check-circle" size={20} color={colors.success} />;
    case 'preparing':
      return <Ionicons name="ios-time" size={20} color={colors.secondary} />;
    case 'pending':
      return <MaterialIcons name="hourglass-empty" size={20} color={colors.warning} />;
    case 'cancelled':
      return <MaterialIcons name="cancel" size={20} color={colors.error} />;
    default:
      return <Ionicons name="help-circle" size={20} color={colors.gray} />;
  }
};

const OrderCard = ({ order }) => (
  <View style={styles.orderCard}>
    <View style={styles.orderHeader}>
      <Text style={styles.orderId}>Order #{order.orderId}</Text>
      <Text style={styles.orderDate}>
        {order.createdAt
          ? new Date(order.createdAt).toLocaleString()
          : 'Date not available'}
      </Text>
    </View>
    <View style={styles.itemsList}>
      {Array.isArray(order.items) && order.items.length > 0 ? (
        order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name || item.itemName || 'Unnamed Item'}</Text>
            <Text style={styles.itemQty}>x{item.quantity}</Text>
            {item.price && (
              <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.orderItems}>No items available</Text>
      )}
    </View>
    <View style={styles.orderFooter}>
      <Text style={styles.orderTotal}>₹{order.totalAmount?.toFixed(2) || '0.00'}</Text>
      <View style={styles.statusRow}>
        {statusIcon(order.status)}
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
  </View>
);

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const userId = user?.id;
  const navigation = useNavigation();

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
        <MaterialIcons name="history" size={48} color={colors.gray} style={{ marginBottom: 12 }} />
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
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderDate: {
    fontSize: 13,
    color: colors.gray,
  },
  orderItems: {
    fontSize: 15,
    color: colors.darkGray,
    marginBottom: 14,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
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
  itemsList: {
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemName: {
    fontSize: 15,
    color: colors.black,
    flex: 1,
  },
  itemQty: {
    fontSize: 15,
    color: colors.darkGray,
    marginLeft: 8,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default OrderHistoryScreen;
