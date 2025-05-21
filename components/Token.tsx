import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

const NotificationComponent = () => {
  useEffect(() => {
    const setupMessaging = async () => {
      try {
        // Request notification permission from the user
        await messaging().requestPermission();
        console.warn('✅ Permission granted');

        // 🔐 Get and log the current FCM token
        const token = await messaging().getToken();
        console.warn('📱 Current FCM Token:', token);

        // Foreground message handler
        messaging().onMessage(async remoteMessage => {
          console.warn('📩 Foreground message received:', remoteMessage.notification);
          await displayNotification(remoteMessage.notification);
        });

        // Background message handler (important)
        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.warn('📥 Background message received:', remoteMessage.notification);
          await displayNotification(remoteMessage.notification);
        });

        // App opened from quit state via notification
        const initial = await messaging().getInitialNotification();
        if (initial) {
          console.warn('🚀 Opened from quit:', initial.notification);
        }
      } catch (err) {
        console.warn('❌ Permission error:', err.message);
      }
    };

    setupMessaging();
  }, []);

  // Function to trigger local notification using expo-notifications
  const displayNotification = async (notification: any) => {
    const { title, body } = notification;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'No Title',
        body: body || 'No Body',
      },
      trigger: null, // trigger immediately
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Notifications will appear here!</Text>
    </View>
  );
};

export default NotificationComponent;
