import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";

export function SingleReturn({ onSelectionChange }) {
  const [selected, setSelected] = useState("One Way");

  const handlePress = (option) => {
    setSelected(option);
    if (onSelectionChange) {
      onSelectionChange(option);
    }
  };

  return (
    <View className="flex-row items-center justify-between mt-4">
      {/* One Way Button */}
      <TouchableOpacity
        className={`h-14 w-[45%] rounded-lg flex items-center justify-center ${
          selected === "One Way" ? "bg-[#3B82F6]" : "bg-gray-100"
        }`}
        onPress={() => handlePress("One Way")}
      >
        <Text className={`font-bold ${selected === "One Way" ? "text-white" : "text-black"}`}>
          One Way
        </Text>
      </TouchableOpacity>

      {/* Round Trip Button */}
      <TouchableOpacity
        className={`h-14 w-[45%] rounded-lg flex items-center justify-center ${
          selected === "Round Trip" ? "bg-[#3B82F6]" : "bg-gray-100"
        }`}
        onPress={() => handlePress("Round Trip")}
      >
        <Text className={`font-bold ${selected === "Round Trip" ? "text-white" : "text-black"}`}>
          Round Trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SingleReturn;
