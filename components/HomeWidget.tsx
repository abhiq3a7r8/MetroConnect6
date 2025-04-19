import React, { useState } from "react";
import { View, Text } from "react-native";
import MButton from "./MButton";
import MetroStationDropdown from "./MetroStationDropdown";

export function HomeWidget({ onRouteFound }: any) {
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [startLine, setStartLine] = useState("");
  const [endLine, setEndLine] = useState("");
  const [error, setError] = useState("");

  const handleFindRoute = () => {
    if (!startStation || !endStation) {
      setError("Please select route");
    } else if (startStation === endStation) {
      setError("Start and End station cannot be the same");
    } else {
      setError(""); 
      onRouteFound(startStation, endStation, startLine, endLine);
    }
    
  };

  return (
    <View className="bg-white w-[90%] rounded-[10] justify-evenly items-center p-2 gap-2">
      <View className="self-start ml-5 mt-4">
        <Text className="font-poppinsMedium text-4xl">Find Your</Text>
        <Text className="font-poppinsMedium text-4xl">Metro Route</Text>
      </View>

      {/* Dropdowns */}
      <MetroStationDropdown
        placeholder="Starting Station"
        onSelect={(station, line) => {
          setStartStation(station)
          setStartLine(line)
        }}
      />
      <MetroStationDropdown
        placeholder="Ending Station"
        onSelect={(station, line) => {
          setEndStation(station)
          setEndLine(line)
        }}
      />

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
