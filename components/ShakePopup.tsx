import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { Accelerometer } from 'expo-sensors';


import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import QRticket from './QRticket';
import PopUpTicket from './PopUpTicket';

const { height } = Dimensions.get('window');
const SHAKE_THRESHOLD = 1.5;
const COOLDOWN_MS = 2000;

export default function ShakePopup() {
  const [visible, setVisible] = useState(false);
  const lastShakeTime = useRef(0);
  const translateY = useSharedValue(height);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    Accelerometer.setUpdateInterval(200);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (magnitude > SHAKE_THRESHOLD && now - lastShakeTime.current > COOLDOWN_MS) {
        lastShakeTime.current = now;
        setVisible(true);
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

    return () => subscription.remove();
  }, []);

  const handleClose = () => {
    translateY.value = withTiming(height, { duration: 300 });
    setTimeout(() => setVisible(false), 300);
  };

  if (!visible) return null;

  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-end bg-black/40 z-50">
      <Animated.View
        style={animatedStyle}
        className="bg-white w-full rounded-t-2xl p-2 shadow-2xl h-[460] items-center"
      >
        <PopUpTicket />
        <Pressable
          onPress={handleClose}
          className="bg-blue-500 py-3 rounded-xl w-[90%]"
        >
          <Text className="text-white text-center font-poppins">Close</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
