import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import "../global.css";
import messaging from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";

/* ---------------------------- Notification Handler --------------------------- */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/* ------------------------- Background Message Handler ------------------------ */
messaging().setBackgroundMessageHandler(async remoteMessage => {
  const { title, body } = remoteMessage.notification || {};
  console.log("📥 [Background] Message:", remoteMessage.notification);

  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
});

/* ----------------------------- Suppress Logs -------------------------------- */
LogBox.ignoreAllLogs();
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  originalConsoleWarn(...args);
};

/* ----------------------------- Root Layout ---------------------------------- */
export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    
    router.replace("/");

    
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const { title, body } = remoteMessage.notification || {};
      console.log("📩 [Foreground] Message:", remoteMessage.notification);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body || "No Body",
          sound: "default",
        },
        trigger: null,
      });
    });

    return unsubscribe; // Clean up on unmount
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
