import { View, Text, Alert, Linking, ActivityIndicator, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { ArrowRight, ArrowUpDown, ArrowLeftRight, TowerControl } from "lucide-react-native";
import Mbutton from "./MButton";
import PaymentMode from "./PaymentMode";

// Utility: Map line name/number to color
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

    return lineColors[line] || "#999999"; // Default gray
};

export function TicketSummary({ startStation, endStation, tripType, numTickets, startLine, endLine }: any) {
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await fetch("https://hfw83ctz6l.execute-api.ap-south-1.amazonaws.com/default/findRoute", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startStation, endStation, startLine, endLine }),
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to fetch ticket data");
                setTicket(data);
            } catch (error: any) {
                Alert.alert("Error", error.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, []);

    const handlePayNow = async () => {
        if (!ticket) return;

        setLoading(true);
        const upiUrl = `upi://pay?pa=audire444@oksbi&pn=Name&mc=1234&tid=TxnID&tr=OrderID&tn=Payment&am=${ticket.fare.replace("₹ ", "")}&cu=INR`;

        try {
            const supported = await Linking.canOpenURL(upiUrl);
            if (supported) {
                await Linking.openURL(upiUrl);

                setTimeout(() => {
                    setTicket((prev: any) => ({ ...prev, paymentStatus: "Paid" }));
                    setLoading(false);
                    router.push({
                        pathname: "/tickets",
                        params: {
                            id: ticket.id,
                            passenger: ticket.passenger,
                            startStation: ticket.from,
                            endStation: ticket.to,
                            numTickets: ticket.passengers,
                            tripType: ticket.ticketType,
                        },
                    });
                }, 3000);
            } else {
                Alert.alert("Error", "Could not open UPI app.");
                setLoading(false);
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong.");
            setLoading(false);
        }
    };
    
    const fetchFare = async () => {
        // Check if startLine and endLine are the same
        if (startLine === endLine) {
            console.log("Start and end lines are the same. Calling fare API with only startStation and endStation.");
            try {
                // API call for the same line (only passing startStation and endStation)
                const response = await fetch("https://9acvye9yfj.execute-api.ap-south-1.amazonaws.com/default/getFare", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ startStation }),
                });
    
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || "Failed to fetch fare data for same line");
    
                // Update ticket fare for same line
                setTicket(prevTicket => ({
                    ...prevTicket,
                    fare: data.fare // Example: Update fare with response
                }));
                console.log("Fare fetched successfully for same line:", data.fare);
    
            } catch (error: any) {
                Alert.alert("Error", error.message || "Failed to fetch fare for the same line.");
            }
        } else {
            
            
            try {
                // First API call from startStation to endStation
                let endStart = ticket.endStart
                
                const response1 = await fetch("https://9acvye9yfj.execute-api.ap-south-1.amazonaws.com/default/getFare", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        startStation: startStation,
                        endStation: endStart
                    }),
                });
    
                const data1 = await response1.json();
                if (!response1.ok) throw new Error(data1.message || "Failed to fetch fare data for startStation -> endStation");
    
                let startEnd = ticket.startEnd
                const response2 = await fetch("https://9acvye9yfj.execute-api.ap-south-1.amazonaws.com/default/getFare", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        startStation: startEnd,
                        endStation: endStation
                    }),
                });
    
                const data2 = await response2.json();
                if (!response2.ok) throw new Error(data2.message || "Failed to fetch fare data for endStation -> startStation");
    
                // Combine the fare data from both directions
                const combinedFare = (data1.fare + data2.fare); // Example: Average fare calculation
                setTicket(prevTicket => ({
                    ...prevTicket,
                    fare: combinedFare
                }));
                
                console.log("Fare fetched successfully for different lines:", combinedFare);
    
            } catch (error: any) {
                Alert.alert("Error", error.message || "Failed to fetch fare for different lines.");
            }
        }
    };
    


    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    if (!ticket) {
        return (
            <View className="p-4">
                <Text className="text-red-500">Unable to load ticket information.</Text>
            </View>
        );
    }

    return (
        <View className="bg-white h-auto w-[90%] rounded-2xl p-4 items-center mt-4">
            <Text className="text-2xl font-poppinsMedium mb-4">Ticket Summary</Text>

            <View className="w-full flex flex-col gap-2">
                {startLine === endLine ? (
                    <View className="flex-row justify-between border p-2 rounded-lg">
                        <View className="items-center w-[40%]">
                            <Text className="text-base">From</Text>
                            <Text className="text-xl font-poppinsMedium text-center">{startStation}</Text>
                        </View>
                        <View className="self-center">
                            <ArrowLeftRight color={"black"} />
                        </View>
                        <View className="items-center w-[40%]">
                            <Text className="text-base">To</Text>
                            <Text className="text-xl font-poppinsMedium text-center">{endStation}</Text>
                        </View>
                    </View>
                ) : (
                    <>
                        {/* Start Line Card */}
                        <View className="border rounded-lg">
                            <View
                                className="h-6 w-full items-center rounded-t-lg"
                                style={{ backgroundColor: getLineColor(startLine) }}
                            >
                                <Text className="font-poppinsBold text-white">{`Metro ${startLine}`}</Text>
                            </View>
                            <View className="flex-row justify-between px-2 mt-1 mb-1">
                                <View className="items-center w-[40%]">
                                    <Text className="text-base">From</Text>
                                    <Text className="text-xl font-poppinsMedium text-center">{startStation}</Text>
                                </View>
                                <View className="self-center">
                                    <ArrowRight color={"black"} />
                                </View>
                                <View className="items-center w-[40%]">
                                    <Text className="text-base">To</Text>
                                    <Text className="text-xl font-poppinsMedium text-center">{ticket.endStart}</Text>
                                </View>
                            </View>
                        </View>

                        <View className="h-10 flex-row items-center self-center">
                            <ArrowUpDown color={"grey"} />
                            <Text className="font-poppins text-xl"> Interchange </Text>
                        </View>

                        {/* End Line Card */}
                        <View className="border rounded-lg">
                            <View
                                className="h-6 w-full items-center"
                                style={{ backgroundColor: getLineColor(endLine) }}
                            >
                                <Text className="font-poppinsBold text-white">{`Metro ${endLine}`}</Text>
                            </View>
                            <View className="flex-row justify-between px-2 mt-1 mb-1">
                                <View className="items-center w-[40%]">
                                    <Text className="text-base">From</Text>
                                    <Text className="text-xl font-poppinsMedium text-center">{ticket.startEnd}</Text>
                                </View>
                                <View className="self-center">
                                    <ArrowRight color={"black"} />
                                </View>
                                <View className="items-center w-[40%]">
                                    <Text className="text-base">To</Text>
                                    <Text className="text-xl font-poppinsMedium text-center">{endStation}</Text>
                                </View>
                            </View>
                        </View>
                    </>
                )}

                {/* Ticket Details */}
                <View className="bg-zinc-100 rounded-lg p-3 gap-2 mt-2">
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-poppins">Ticket ID:</Text>
                        <Text className="text-lg font-poppins">{ticket.id}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-poppins">Passenger:</Text>
                        <Text className="text-lg font-poppins">{ticket.passenger}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-poppins">No. of tickets:</Text>
                        <Text className="text-lg font-poppins">{numTickets}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-lg font-poppins">Ticket Type:</Text>
                        <Text className="text-lg font-poppins">{tripType}</Text>
                    </View>
                </View>

                {/* Fare Section */}
                <View>
                    <TouchableOpacity className="h-12 w-32 self-center bg-blue-200 rounded-md items-center" onPress={fetchFare}>
                        <Text className="font-poppins">getfare</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-between items-center mb-2 mt-2">
                    <Text className="text-2xl font-poppinsMedium">Total Fare:</Text>
                    <Text className="text-2xl font-poppinsMedium border p-2 rounded-lg">R{ticket.fare}</Text>
                </View>

                <PaymentMode />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007BFF" className="mt-4" />
            ) : (
                <Mbutton buttontext="Pay Now" onPress={handlePayNow} disabled={loading} />
            )}
        </View>
    );
}

export default TicketSummary;
