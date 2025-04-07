import React, { useState } from "react";
import { View, Text } from "react-native";
import MButton from "./MButton";
import MetroStationDropdown from "./MetroStationDropdown";

export function HomeWidget({ onRouteFound }) {
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [error, setError] = useState("");

  const handleFindRoute = () => {
    if (!startStation || !endStation) {
      setError("Please select route");
    } else if (startStation === endStation) {
      setError("Start and End station cannot be the same");
    } else {
      setError(""); 
      onRouteFound(startStation, endStation);
    }
  };

  return (
    <View className="bg-white h-[400] w-[90%] rounded-[10] justify-evenly items-center p-4">
      <View className="self-start ml-5">
        <Text className="font-poppinsMedium text-4xl">Find Your</Text>
        <Text className="font-poppinsMedium text-4xl">Metro Route</Text>
      </View>

      {/* Dropdowns */}
      <MetroStationDropdown zIndex={400} placeholder="Starting Station" onSelect={setStartStation} />
      <MetroStationDropdown zIndex={200} placeholder="Ending Station" onSelect={setEndStation} />

      {/* Error Message */}
      {error !== "" && (
        <Text className="text-red-500 text-sm font-poppinsMedium mt-[-10] mb-1">
          {error}
        </Text>
      )}

      {/* Find Button */}
      <MButton buttontext="Find" onPress={handleFindRoute} />
    </View>
  );
}

export default HomeWidget;
