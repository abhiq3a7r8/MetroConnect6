import React, { useState } from "react";
import { View, Text } from "react-native";
import { ArrowLeftRight } from "lucide-react-native";
import { useRouter } from "expo-router"; // Import Expo Router
import SingleReturn from "./SingleReturn";
import FixedStopsSlider from "./FixedStopsSlider";
import Mbutton from "./MButton";

const MetroRouteResult = ({ startStation, endStation, startLine, endLine }: any) => {
  const router = useRouter();
  const [tripType, setTripType] = useState();
  const [numTickets, setNumTickets] = useState();

  if (!startStation || !endStation) return null;

  const handleBookTicket = () => {
    router.push({
      pathname: "/bookingsummary",
      params: {
        startStation,
        endStation,
        startLine,
        endLine,
        tripType,
        numTickets,
      },
    });
  };

  // Determine route details display
  const isSameLine = startLine === endLine;
  const lineLabel = isSameLine ? `${startLine}` : `${startLine} → ${endLine}`;
  const transferLabel = isSameLine ? "Non-stop" : "Line Transfer";

  return (
    <View className="bg-white h-[400] mt-4 p-4 w-[90%] rounded-[10]">
      <Text className="text-2xl font-poppinsMedium text-center mt-2 mb-2">Route Details</Text>
      <View className="h-[2] w-full bg-zinc-200 mb-3" />

      {/* Line Info Card */}
      <View
        className={`h-10 w-full self-center border ${
          isSameLine ? "bg-green-100 border-green-100" : "bg-yellow-100 border-yellow-100"
        } mb-4 rounded-md flex-row items-center p-2 justify-between`}
      >
        <Text className="font-poppinsMedium">{lineLabel}</Text>
        <Text className="font-poppins">{transferLabel}</Text>
      </View>


      {/* From → To Info */}
      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-base">From</Text>
          <Text className="text-xl font-poppinsMedium w-32 text-center">{startStation}</Text>
        </View>
        <View className="self-center">
          <ArrowLeftRight color={"black"} />
        </View>
        <View className="items-center">
          <Text className="text-base">To</Text>
          <Text className="text-xl font-poppinsMedium w-32 text-center">{endStation}</Text>
        </View>
      </View>

      {/* Trip Type */}
      <SingleReturn onSelectionChange={setTripType} />
      <View className="h-[2] w-full bg-zinc-200 mt-3 mb-2" />
      <Text className="text-xl font-poppins text-center">Number of Tickets</Text>

      {/* Ticket Slider */}
      <FixedStopsSlider onStopChange={setNumTickets} />

      <View className="h-[2] w-full bg-zinc-200 mt-3 mb-2" />

      {/* Book Button */}
      <View className="mt-4 flex items-center w-full">
        <Mbutton buttontext="Book Ticket" onPress={handleBookTicket} />
      </View>
    </View>
  );
};

export default MetroRouteResult;
