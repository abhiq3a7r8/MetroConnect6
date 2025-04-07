import { View, Text } from "react-native";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg"; // Import QR Code library
import Mbutton from "./MButton";

export function QRticket({ startStation, endStation , tripType , numTickets}) {
    const [ticket, setTicket] = useState({
        id: "MT20250402",
        passenger: "Abhirat More",
        from: startStation,
        to: endStation,
        passengers: numTickets,
        ticketType: tripType,
        fare: "₹ 30",
        paymentStatus: "Pending",
    });

    return (
        <View className="bg-white h-[auto] w-[90%] rounded-2xl p-5 items-center mt-4">
            
            <Text className="text-2xl font-poppinsMedium mb-4">Ticket</Text>

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
                </View>
            </View>

            <View className="bg-zinc-100 w-[90%] rounded-2xl items-center m-4">
            <View className="mt-6 mb-10">
                <Text className="text-lg font-poppinsMedium mb-2 self-center">Scan to Validate</Text>
                
                <QRCode 
                    value={`Ticket ID: ${ticket.id}, Passenger: ${ticket.passenger}, From: ${ticket.from}, To: ${ticket.to}`}
                    size={150}
                    backgroundColor="white"
                />
            </View>
            </View>
        </View>
    );
}

export default QRticket;
