import { View, ScrollView, StyleSheet } from "react-native";
import HomeWidget from "@/components/HomeWidget";
import MetroRouteResult from "@/components/MetroRouteResult";
import { Navbar } from "@/components/Navbar";
import HomeHeader from "@/components/HomeHeader";
import { useState } from "react";
import ShakePopup from "@/components/ShakePopup";

export default function Dashboard() {
  const [route, setRoute] = useState({ start: "", end: "" , startLine: "", endLine: ""});

  const handleRouteFound = (startStation: any, endStation: any, startLine: any, endLine: any) => {
    setRoute({ start: startStation, end: endStation, startLine: startLine, endLine: endLine});
    
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <HomeHeader />
        <HomeWidget onRouteFound={handleRouteFound} />
        {route.start && route.end && <MetroRouteResult startStation={route.start} endStation={route.end} startLine={route.startLine} endLine={route.endLine}/>}
      </ScrollView>
      {/* <ShakePopup /> */}
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
