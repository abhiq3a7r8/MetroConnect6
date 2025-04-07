import { View, ScrollView, StyleSheet } from "react-native";
import HomeWidget from "@/components/HomeWidget";
import MetroRouteResult from "@/components/MetroRouteResult";
import { Navbar } from "@/components/Navbar";
import HomeHeader from "@/components/HomeHeader";
import { useState } from "react";
import ShakePopup from "@/components/ShakePopup";

export default function Dashboard() {
  const [route, setRoute] = useState({ start: "", end: "" });

  // Function to update state when route is found
  const handleRouteFound = (startStation, endStation) => {
    setRoute({ start: startStation, end: endStation });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <HomeHeader />
        
        
        <HomeWidget onRouteFound={handleRouteFound} />

        
        {route.start && route.end && <MetroRouteResult startStation={route.start} endStation={route.end} />}

        
        <View className="flex-row justify-between mt-8 w-[90%]">
          <View className="bg-white h-36 w-[47%] rounded-[10] justify-evenly items-center p-4"></View>
          <View className="bg-white h-36 w-[47%] rounded-[10] justify-evenly items-center p-4"></View>
        </View>
        <View className="flex-row justify-between mt-4 w-[90%]">
          <View className="bg-white h-36 w-[47%] rounded-[10] justify-evenly items-center p-4"></View>
          <View className="bg-white h-36 w-[47%] rounded-[10] justify-evenly items-center p-4"></View>
        </View>
      </ScrollView>
      <ShakePopup />
      <Navbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6", 
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 80,
  },
});
