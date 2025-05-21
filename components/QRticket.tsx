import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { ArrowLeftRight } from "lucide-react-native";

// Function to get the line color based on line name
const getLineColor = (line: string) => {
  const lineColors: { [key: string]: string } = {
    "Line 2A": "#facc15", // Yellow
    "2A": "#facc15",
    "Line 7": "#DC2626", // Red
    "7": "#DC2626",
    "Line 1": "#3b82f6", // Blue
    "1": "#3b82f6",
    "Line 6": "#8B5CF6", // Violet
    "6": "#8B5CF6",
    "Line 4": "#00C853", // Green
    "4": "#00C853",
    // Add more as needed
  };
  
  return lineColors[line] || "#000000"; // Default to black if line not found
};

export function QRticket({ userId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("https://ies2lxcq64.execute-api.ap-south-1.amazonaws.com/default/getTickets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: "414448" }),
        });

        const data = await response.json();
        setTickets(data.tickets);  // Make sure your backend sends { tickets: [...] }
        console.log(data);  // Log the full response to check structure
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [userId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-base font-poppins">Loading Tickets...</Text>
      </View>
    );
  }

  if (tickets.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mt-10">
        <Text className="text-lg font-poppins">No Tickets Found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="w-full px-4" contentContainerStyle={{ paddingBottom: 60 }}>
      {tickets.map((ticket, index) => {
        const lineColor = getLineColor(ticket.line);
        console.log(lineColor)  // Get the line color based on the line name

        return (
          <View key={index} className="bg-white rounded-2xl p-5 items-center my-4 shadow-md">
            <View className="w-full flex flex-col gap-4">
              {/* Line color header */}
              <View
                className="h-6 w-full items-center rounded-t-lg"
                style={{ backgroundColor: lineColor }}
              >
                <Text className="font-poppinsBold text-white">{`Metro ${ticket.line}`}</Text>
              </View>

              <View className="flex-row justify-between border p-2 rounded-lg">
                <View className="items-center">
                  <Text className="text-base">From</Text>
                  <Text className="text-xl font-poppinsMedium">{ticket.start}</Text>
                </View>
                <View className="self-center">
                  <ArrowLeftRight color={"black"} />
                </View>
                <View className="items-center">
                  <Text className="text-base">To</Text>
                  <Text className="text-xl font-poppinsMedium">{ticket.end}</Text>
                </View>
              </View>

              <View className="bg-zinc-100 rounded-lg p-3 gap-2">
                <View className="flex-row justify-between">
                  <Text className="text-lg font-poppins">Ticket ID:</Text>
                  <Text className="text-lg font-poppins">{ticket.ticket_id}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-lg font-poppins">Fare:</Text>
                  <Text className="text-lg font-poppins">₹{ticket.fare}</Text>
                </View>
              </View>
            </View>

            <View className="bg-zinc-100 w-[90%] rounded-2xl items-center m-4">
              <View className="mt-6 mb-10">
                <Text className="text-lg font-poppinsMedium mb-2 self-center">Scan to Validate</Text>
                {/* Use ticket.ticket_id_hash to generate QR code */}
                <QRCode
                  value={ticket.ticket_id_hash}  // Access ticket's specific property
                  size={150}
                  backgroundColor="white"
                />
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default QRticket;
