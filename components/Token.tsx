import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';

export default function Token() {
  useEffect(() => {
    const setupFCM = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('✅ FCM Token:', token);

        // 👉 Send this token to your backend to register with AWS SNS
        // await fetch('https://your-backend.com/register', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ token }),
        // });
      } else {
        Alert.alert('Permission Denied', 'Notification permissions not granted.');
      }
    };

    setupFCM();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground notification:', remoteMessage.notification);
      Alert.alert(remoteMessage.notification?.title, remoteMessage.notification?.body);
    });

    return unsubscribe; // clean up
  }, []);

  return (
    <View>
      <Text>🔔 Push Notification Service Initialized</Text>
    </View>
  );
}
