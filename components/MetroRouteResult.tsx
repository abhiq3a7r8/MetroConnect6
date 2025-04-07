import React, { useState } from "react";
import { View, Text } from "react-native";
import { ArrowLeftRight } from "lucide-react-native";
import { useRouter } from "expo-router"; // Import Expo Router
import SingleReturn from "./SingleReturn";
import FixedStopsSlider from "./FixedStopsSlider";
import Mbutton from "./MButton";

const MetroRouteResult = ({ startStation, endStation }) => {
  const router = useRouter(); // Initialize router

  const [tripType, setTripType] = useState(); 
  const [numTickets, setNumTickets] = useState(); 

  if (!startStation || !endStation) return null; // Don't show if empty

  const handleBookTicket = () => {
    router.push({
      pathname: "/bookingsummary",
      params: {
        startStation,
        endStation,
        tripType,
        numTickets,
      },
    });
  };

  return (
    <View className="bg-white h-[400] mt-4 p-4 w-[90%] rounded-[10]">
      <Text className="text-xl font-poppins text-center mb-6">Route Details</Text>
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-base">From</Text>
          <Text className="text-xl font-poppinsMedium">{startStation}</Text>
        </View>
        <View className="self-center">
          <ArrowLeftRight />
        </View>
        <View className="items-center">
          <Text className="text-base">To</Text>
          <Text className="text-xl font-poppinsMedium">{endStation}</Text>
        </View>
      </View>

      
      <SingleReturn onSelectionChange={setTripType} />

      <Text className="text-xl font-poppins text-center mt-10">Number of Tickets</Text>

      
      <FixedStopsSlider onStopChange={setNumTickets} />

      <View className="mt-10 flex items-center w-full">
        <Mbutton buttontext="Book Ticket" onPress={handleBookTicket} />
      </View>
    </View>
  );
};

export default MetroRouteResult;
