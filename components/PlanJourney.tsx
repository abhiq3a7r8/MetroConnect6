import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Keyboard,
  Alert,
  Linking,
} from "react-native";
import { MTextBox } from "./MTextBox";
import {
  CircleStop,
  Locate,
  MousePointer2,
  SquareArrowOutUpRight,
} from "lucide-react-native";
import * as Location from "expo-location";

const suburbs = [
  { name: "Andheri", lat: 19.1197, lng: 72.8468 },
  { name: "Bandra", lat: 19.0602, lng: 72.836 },
  { name: "Borivali", lat: 19.229, lng: 72.857 },
  { name: "Goregaon", lat: 19.155, lng: 72.8494 },
  { name: "Dadar", lat: 19.018, lng: 72.8436 },
  { name: "Malad", lat: 19.1852, lng: 72.8424 },
  { name: "Vile Parle", lat: 19.1006, lng: 72.8485 },
  { name: "Kurla", lat: 19.0726, lng: 72.8826 },
  { name: "Powai", lat: 19.1187, lng: 72.9051 },
  { name: "Colaba", lat: 18.9075, lng: 72.8125 },
  { name: "Worli", lat: 18.998, lng: 72.8176 },
  { name: "Chembur", lat: 19.06, lng: 72.8962 },
  { name: "Ghatkopar", lat: 19.08, lng: 72.9106 },
  { name: "Mulund", lat: 19.1726, lng: 72.9564 },
  { name: "Kandivali", lat: 19.2059, lng: 72.8497 },
  { name: "Santacruz", lat: 19.079, lng: 72.8413 },
  { name: "Sion", lat: 19.045, lng: 72.8592 },
  { name: "Jogeshwari", lat: 19.1358, lng: 72.8485 },
  { name: "Charni Road", lat: 18.9516, lng: 72.8195 },
  { name: "Marine Lines", lat: 18.9466, lng: 72.8232 },
];

export function PlanJourney() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [isOriginFocused, setIsOriginFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [originCoords, setOriginCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = location.coords;
      const latLng = `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`;
      setOrigin(latLng);
      setOriginCoords({ lat: coords.latitude, lng: coords.longitude });
      setIsOriginFocused(false);
      Keyboard.dismiss();
    } catch (err) {
      console.error(err);
      alert("Unable to fetch location.");
    }
  };

  const handleViewOnMap = async () => {
    if (!originCoords || !destinationCoords) {
      alert("Both origin and destination must be selected.");
      return;
    }

    try {
      const response = await fetch("http://192.168.133.42:4000/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: originCoords,
          destination: destinationCoords,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("📍 Route response:", data);
        Alert.alert("Route Info", `Distance: ${data.data.distance}\nDuration: ${data.data.duration}`);

        // Construct the map URL
        const originStr = `${originCoords.lat},${originCoords.lng}`;
        const destStr = `${destinationCoords.lat},${destinationCoords.lng}`;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=transit`;

        // Open in browser
        Linking.openURL(url);
      } else {
        console.error("❌ Error:", data);
        alert("Failed to get route info.");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Network error while fetching route.");
    }
  };

  const filteredOriginSuggestions = suburbs.filter(
    (s) =>
      s.name.toLowerCase().startsWith(origin.toLowerCase()) && origin !== ""
  );

  const filteredDestinationSuggestions = suburbs.filter(
    (s) =>
      s.name.toLowerCase().startsWith(destination.toLowerCase()) &&
      destination !== ""
  );

  return (
    <View className="bg-white h-auto w-full rounded-[10] justify-start items-center p-4 mb-6 space-y-4">
      <Text className="font-poppinsMedium text-2xl self-start ml-4 mb-3">
        Plan your Journey
      </Text>

      {/* Origin input */}
      <View className="flex-row w-[85%] items-center gap-2">
        <MousePointer2 color={"black"} />
        <MTextBox
        placeholder="Origin"
        value={origin}
        onChangeText={setOrigin}
        onFocus={() => {
          setIsOriginFocused(true);
          setIsDestinationFocused(false);
        }}
        showClearButton
        onClear={() => {
          setOrigin("");
          setOriginCoords(null);
        }}
      />
      </View>

      {/* Origin Suggestions */}
      {isOriginFocused && (
        <View className="w-[85%] self-start pl-10">
          {filteredOriginSuggestions.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => {
                setOrigin(s.name);
                setOriginCoords({ lat: s.lat, lng: s.lng });
                setIsOriginFocused(false);
                Keyboard.dismiss();
              }}
              className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 my-1"
            >
              <Text className="text-base">{s.name}</Text>
            </Pressable>
          ))}
          <TouchableOpacity
            onPress={handleUseCurrentLocation}
            className="bg-green-50 border border-gray-400 rounded-md flex-row items-center p-2 gap-2 my-2"
          >
            <Locate color="black" />
            <Text>Use current location</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Destination input */}
      <View className="flex-row w-[85%] items-center gap-2 mt-2">
        <CircleStop color={"black"} />
        <MTextBox
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
        onFocus={() => {
          setIsDestinationFocused(true);
          setIsOriginFocused(false);
        }}
        showClearButton
        onClear={() => {
          setDestination("");
          setDestinationCoords(null);
        }}
      />
      </View>

      {/* Destination Suggestions */}
      {isDestinationFocused && (
        <View className="w-[85%] self-start pl-10">
          {filteredDestinationSuggestions.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => {
                setDestination(s.name);
                setDestinationCoords({ lat: s.lat, lng: s.lng });
                setIsDestinationFocused(false);
                Keyboard.dismiss();
              }}
              className="bg-gray-100 border border-gray-300 px-3 w-full my-1 py-2 ml-6"
            >
              <Text className="text-base">{s.name}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Show journey summary */}
      {origin && destination && (
        <View className="w-[90%] mt-4 bg-blue-50 border border-blue-300 rounded-md p-4 items-start">
          <Text className="text-lg font-poppinsMedium mb-2">
            Journey Summary
          </Text>
          <Text className="text-base text-gray-700">
            From: <Text className="font-semibold">{origin}</Text>
          </Text>
          <Text className="text-base text-gray-700">
            To: <Text className="font-semibold">{destination}</Text>
          </Text>

          {originCoords && destinationCoords && (
            <View className="mt-2">
              <Text className="text-sm text-gray-600">
                Origin Coords: {originCoords.lat.toFixed(4)}, {originCoords.lng.toFixed(4)}
              </Text>
              <Text className="text-sm text-gray-600">
                Destination Coords: {destinationCoords.lat.toFixed(4)}, {destinationCoords.lng.toFixed(4)}
              </Text>
            </View>
          )}

          <TouchableOpacity
            className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
            onPress={handleViewOnMap}
          >
            <View className="flex-row items-center">
              <Text className="text-white font-semibold mr-4">View on Map</Text>
              <SquareArrowOutUpRight color={"white"} size={18} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default PlanJourney;
