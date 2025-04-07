import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

export function NormalSlider({ min = 0, max = 100, step = 1 }) {
  const [value, setValue] = useState(min);

  return (
    <View className="w-[80%] items-center">
      <Text className="text-lg font-semibold mb-2">Value: {value}</Text>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={(val) => setValue(val)}
        minimumTrackTintColor="#3B82F6"
        maximumTrackTintColor="#D1D5DB"
        thumbTintColor="#3B82F6"
      />
    </View>
  );
}

export default NormalSlider;
