import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getExpoPushTokenAsync, requestPermissionsAsync } from 'expo-notifications';
import { getMessaging, getToken } from 'firebase/messaging';

class NotificationManager {
  static async requestPermission() {
    const { status } = await requestPermissionsAsync();
    return status === 'granted';
  }

  static async getExpoPushToken() {
    // For Expo push notifications
    const { data } = await getExpoPushTokenAsync();
    return data;
  }

  static async getFCMToken() {
    // For Firebase Cloud Messaging (FCM) push notifications
    const messaging = getMessaging();
    const token = await getToken(messaging, {
      vapidKey: 'YOUR_FCM_VAPID_KEY', // Replace with your FCM VAPID Key if applicable
    });
    return token;
  }

  static listenForeground(listener: (remoteMessage: any) => void) {
    Notifications.addNotificationReceivedListener(listener);
  }

  static setBackgroundHandler(handler: (remoteMessage: any) => void) {
    Notifications.addNotificationResponseReceivedListener(handler);
  }

  static handleNotificationOpenedApp(listener: (remoteMessage: any) => void) {
    Notifications.addNotificationResponseReceivedListener(listener);
  }

  static async getInitialNotification(listener: (response: any) => void) {
    const response = await Notifications.getInitialNotificationAsync();
    listener(response);
  }
}

export default NotificationManager;
