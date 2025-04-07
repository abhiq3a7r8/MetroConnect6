import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { QrCode } from "lucide-react-native";
import Mbutton from "@/components/MButton";
import BarChartComponent from "@/components/BarChartComponent";
import Metrostatus from "@/components/Metrostatus";
import { BarCodeScanner } from "expo-barcode-scanner"; // Import BarCodeScanner
import { useState, useEffect } from "react";

export function Admin() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync(); 
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
  
    
    const ticketRegex = /Ticket ID:\s*(\w+),\s*Passenger:\s*(.*?),\s*From:\s*(.*?),\s*To:\s*(.*)/;
    const match = data.match(ticketRegex);
  
    if (match) {
      const [, ticketId, passenger, from, to] = match;
  
      if (ticketId === 'MT20250402') {
        alert(
          `✅ Valid Ticket!\n\n` +
          `Ticket ID: ${ticketId}\n` +
          `Passenger: ${passenger}\n` +
          `From: ${from}\n` +
          `To: ${to}`
        );
      } else {
        alert(`❌ Invalid Ticket ID: ${ticketId}`);
      }
    } else {
      alert(`❌ Invalid QR Code Format.\nScanned Data: ${data}`);
    }
  
    setShowScanner(false);
  };
  
  
  

  const openScanner = () => {
    setShowScanner(true);
    setScanned(false); // Reset scanned state
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {showScanner ? (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={{ flex: 1, backgroundColor: "transparent", flexDirection: "row", justifyContent: 'center' }}>
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: "flex-end",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={closeScanner}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text className="font-poppinsMedium text-3xl mt-8">Admin Dashboard</Text>

          <View className="mt-8 bg-white h-32 w-[90%] rounded-[10] p-4 flex-row justify-between items-center">
            <View>
              <Text className="self-start font-poppins text-xl">All Systems</Text>
              <Text className="self-start font-poppins text-3xl text-green-600">
                Operational
              </Text>
            </View>
            <View className="h-6 w-6 rounded-full bg-green-600"></View>
            <View className="h-6 w-6 rounded-full bg-green-600"></View>
            <View className="h-6 w-6 rounded-full bg-slate-300"></View>
          </View>

          <BarChartComponent
            data={[
              { value: 250, label: "M" },
              { value: 500, label: "T", frontColor: "#177AD5" },
              { value: 745, label: "W", frontColor: "#177AD5" },
              { value: 320, label: "T" },
              { value: 600, label: "F", frontColor: "#177AD5" },
              { value: 256, label: "S" },
              { value: 300, label: "S" },
            ]}
          />

          <ScrollView contentContainerStyle={styles.metroStatusContainer} className="mt-8 bg-white h-72 w-[90%] rounded-[10] p-4">
            <Metrostatus lineNumber="4" bgColor="bg-blue-200" nextTrainTime="3" />
            <Metrostatus lineNumber="7" bgColor="bg-purple-200" nextTrainTime="5" />
            <Metrostatus lineNumber="3" bgColor="bg-green-200" nextTrainTime="6" />
            <Metrostatus lineNumber="5" bgColor="bg-orange-200" nextTrainTime="5" />
            <Metrostatus lineNumber="6" bgColor="bg-pink-200" nextTrainTime="3" />
            <Metrostatus lineNumber="14" bgColor="bg-purple-200" nextTrainTime="5" />
          </ScrollView>

          <View className="mt-8 bg-white h-auto w-[90%] rounded-[10] p-4 items-center gap-2">
            <Text className="font-poppins text-2xl">Manual Ticket Validation</Text>
            <QrCode size={100} color={"black"} />
            <Mbutton buttontext="Validate QR" onPress={openScanner} />
          </View>
        </ScrollView>
      )}
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
  metroStatusContainer: {
    flexGrow: 1,
  },
});

export default Admin;