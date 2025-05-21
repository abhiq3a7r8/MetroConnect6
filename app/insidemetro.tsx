import React, { useEffect, useState, useRef } from "react";
import { View, Text, Dimensions, Touchable, TouchableOpacity } from "react-native";
import { Accelerometer } from "expo-sensors";
import * as Location from "expo-location";
import InMetro from "@/components/InMetro";
import { Train } from "lucide-react-native";
import WebView from "react-native-webview";
import MetroLineHorizontal from "@/components/MetroLineHorizontal";
import ShakePopup from "@/components/ShakePopup";
import { router } from "expo-router";

const { width } = Dimensions.get("window");
const height = 200;

export default function InsideMetro() {
  const [speed, setSpeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastAccel = useRef({ x: 0, y: 0, z: 0 });

  // Fetch and post location to backend
  useEffect(() => {
    (async () => {
      
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn("Permission to access location was denied");
          return;
        }
        setTimeout(() => setLoading(false), 1000); 
        const location = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = location.coords;

        // Send location to backend (non-blocking)
        fetch("http://192.168.179.100:4000/api/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lng }),
        }).catch(err => console.log("location post error: ", err)); //handle errors during post, but dont block.

        
    })();
  }, []);

  const takeMap = () => {
    router.push("/bigmap")
  }

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const dx = x - lastAccel.current.x;
      const dy = y - lastAccel.current.y;
      const dz = z - lastAccel.current.z;

      const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const newSpeed = Math.min(60, delta * 10);
      const finalSpeed = newSpeed < 1 ? 0 : parseFloat(newSpeed.toFixed(2));

      setSpeed(finalSpeed);
      lastAccel.current = { x, y, z };
    });

    Accelerometer.setUpdateInterval(200);

    return () => {
      subscription.remove();
    };
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="font-poppinsMedium text-2xl">Fetching Location ...</Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <InMetro />
      <View className="self-center w-[90%] h-auto mt-6 items-center bg-white p-4 rounded-xl justify-between">
        <View className="flex-row h-10 w-full items-center justify-between px-2 mb-4">
          <View className="w-auto bg-blue-200 p-1 rounded-md px-2">
            <Text className="font-poppinsMedium">Blue Line 1</Text>
          </View>
          <View className="h-[2] w-24 bg-zinc-400"></View>
          <View className="h-auto w-auto items-center flex-row justify-between gap-2 p-1 border rounded-md">
            <Train color={"black"} size={"20"} />
            <Text className="font-poppinsMedium text-lg">9217</Text>
          </View>
        </View>

        <View className="rounded-lg self-start ">
          {/* <MetroLineHorizontal /> */}
          <View className="w-auto items-center flex-row">
            <View className="items-center ml-3">
            <Text className="font-poppins text-base "> Next Station: </Text>
            <Text className="font-poppinsMedium text-2xl">--</Text>
            </View>
            <View className="bg-red-50 h-auto py-2 ml-16 mb-4 items-center justify-center">
              <Text className="font-poppinsMedium text-3xl text-zinc-700 ">
                {speed.toFixed(2)} km/h
              </Text>
              <Text className="font-poppins text-lg">ETA: </Text>
            </View>
          </View>
        </View>

        <View style={{ width: width * 0.8, height }}>
          <WebView
            source={{ uri: "http://192.168.179.100:4000/map" }}
            style={{ width: "100%", height: "100%", borderRadius: 40 }}
            injectedJavaScript={`
              const meta = document.createElement('meta');
              meta.setAttribute('name', 'viewport');
              meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
              document.getElementsByTagName('head')[0].appendChild(meta);
            `}
            scalesPageToFit={false}
            javaScriptEnabled
            domStorageEnabled
          />

          <Text className="font-poppinsMedium text-base text-zinc-700 mb-3">
            Speed {speed.toFixed(2)} km/h
          </Text>
          <TouchableOpacity onPress={takeMap}>
            <Text className="font-poppins">full screen</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ShakePopup />
    </View>
  );
}