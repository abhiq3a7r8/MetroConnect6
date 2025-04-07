import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export function FixedStopsSlider({ onStopChange }) {
  const stops = ["1", "2", "3", "4"];
  const [selectedStop, setSelectedStop] = useState(0);

  const handlePress = (index) => {
    setSelectedStop(index);
    if (onStopChange) {
      onStopChange(stops[index]);
    }
  };

  return (
    <View className="w-full items-center mt-6">
      {/* Slider Line */}
      

      {/* Stops */}
      <View className="flex-row justify-between w-[80%]">
        {stops.map((stop, index) => (
          <TouchableOpacity
            key={index}
            className="items-center"
            onPress={() => handlePress(index)}
          >
            {/* Stop Indicator */}
            <View
              className={`h-6 w-6 rounded-full ${
                selectedStop === index ? "bg-[#3B82F6]" : "bg-gray-400"
              }`}
            />
            {/* Stop Label */}
            <Text className="mt-2 text-sm font-medium">
              {stop}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default FixedStopsSlider;
