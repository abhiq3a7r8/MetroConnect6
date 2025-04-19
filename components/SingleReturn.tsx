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
        className={`h-14 w-[45%] rounded-lg flex items-center justify-center 
          ${selected === "One Way" ? "bg-blue-100 border border-blue-500" : "bg-gray-100 border border-gray-300"}`}
        onPress={() => handlePress("One Way")}
      >
        <Text className={`font-poppins ${selected === "One Way" ? "text-black" : "text-black"}`}>
          One Way
        </Text>
      </TouchableOpacity>

      {/* Round Trip Button */}
      <TouchableOpacity
        className={`h-14 w-[45%] rounded-lg flex items-center justify-center 
          ${selected === "Round Trip" ? "bg-blue-100 border border-blue-700" : "bg-gray-100 border border-gray-300"}`}
        onPress={() => handlePress("Round Trip")}
      >
        <Text className="font-poppins">
          Round Trip
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SingleReturn;
