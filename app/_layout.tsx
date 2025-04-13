import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { LogBox } from "react-native";
import "../global.css";

LogBox.ignoreAllLogs();
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  originalConsoleWarn(...args);
};

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}

