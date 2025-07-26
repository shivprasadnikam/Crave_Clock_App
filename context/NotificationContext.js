import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { foodAPI } from '../services/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      console.log('[NotificationContext] Expo push token:', token);
      setExpoPushToken(token);
      if (user?.id && token) {
        console.log('[NotificationContext] Sending push token to backend for user:', user.id);
        foodAPI.savePushToken(user.id, token)
          .then(() => console.log('[NotificationContext] Push token saved to backend'))
          .catch(err => console.error('[NotificationContext] Error saving push token:', err));
      }
    });
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('[NotificationContext] Notification received:', notification);
      setNotification(notification);
    });
    return () => subscription.remove();
  }, [user?.id]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}
