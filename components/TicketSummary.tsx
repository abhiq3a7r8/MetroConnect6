import { View, Text, Alert, Linking, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router"; 
import { ArrowLeftRight } from "lucide-react-native";
import Mbutton from "./MButton";
import PaymentMode from "./PaymentMode";

export function TicketSummary({ startStation, endStation, tripType, numTickets }) {
    

    const [ticket, setTicket] = useState({
        id: "MT20250402",
        passenger: "Abhirat More",
        from: startStation || "Station A",
        to: endStation || "Station B",
        date: "April 2, 2025",
        time: "10:30 AM",
        passengers: numTickets,
        ticketType: tripType,
        fare: `₹ ${numTickets ? numTickets * 30 : 30}`, 
        paymentStatus: "Pending",
    });

    const [loading, setLoading] = useState(false); 

    const handlePayNow = async () => {
        setLoading(true); 
        const upiUrl = `upi://pay?pa=audire444@oksbi&pn=Name&mc=1234&tid=TxnID&tr=OrderID&tn=Payment&am=${ticket.fare.replace("₹ ", "")}&cu=INR`;

        try {
            const supported = await Linking.canOpenURL(upiUrl);
            if (supported) {
                await Linking.openURL(upiUrl);

                
                setTimeout(() => {
                    setTicket((prev) => ({ ...prev, paymentStatus: "Paid" }));
                    setLoading(false); 
                }, 3000);
                console.log(ticket)
                router.push({
                    pathname: "/tickets",
                    params: {
                      id: ticket.id,
                      passenger: ticket.passenger,
                      startStation: ticket.from,
                      endStation: ticket.to,
                      numTickets: ticket.passengers,
                      tripType: ticket.ticketType,
                    }
                  });
                  
            } else {
                Alert.alert("Error", "Could not open Google Pay.");
                setLoading(false);
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <View className="bg-white h-[500] w-[90%] rounded-2xl p-5 items-center mt-4">
            <Text className="text-2xl font-poppinsMedium mb-4">Ticket Summary</Text>

            <View className="w-full flex flex-col gap-4">
                <View className="flex-row justify-between border p-2 rounded-lg">
                    <View className="items-center">
                        <Text className="text-base">From</Text>
                        <Text className="text-xl font-poppinsMedium">{ticket.from}</Text>
                    </View>
                    <View className="self-center">
                        <ArrowLeftRight />
                    </View>
                    <View className="items-center">
                        <Text className="text-base">To</Text>
                        <Text className="text-xl font-poppinsMedium">{ticket.to}</Text>
                    </View>
                </View>

                <View className="bg-zinc-100 rounded-lg p-3 gap-2">
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
                        <Text className="text-lg font-poppins">{ticket.passengers}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-lg font-poppins">Ticket Type:</Text>
                        <Text className="text-lg font-poppins">{ticket.ticketType}</Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-lg font-poppins">Payment Status:</Text>
                        <Text className={`text-lg font-poppins ${ticket.paymentStatus === "Paid" ? "text-green-500" : "text-red-500"}`}>
                            {ticket.paymentStatus}
                        </Text>
                    </View>
                </View>

                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-2xl font-poppinsMedium">Total Fare:</Text>
                    <Text className="text-2xl font-poppinsMedium border p-2 rounded-lg">{ticket.fare}</Text>
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
