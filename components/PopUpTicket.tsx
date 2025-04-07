import { View, Text } from "react-native";
import { useState } from "react";
import { ArrowLeftRight } from "lucide-react-native";
import QRCode from "react-native-qrcode-svg"; // Import QR Code library
import Mbutton from "./MButton";

export function PopUpTicket() {
    const [ticket, setTicket] = useState({
        id: "MT20250402",
        passenger: "Abhirat More",
        from: "Andheri",
        to: "Versova",
        passengers: "1",
        ticketType: "one-way",
        fare: "₹ 30",
        paymentStatus: "Pending",
    });

    return (
        <View className="bg-white h-[auto] w-full rounded-2xl p-5 items-center">
            
            <Text className="text-2xl font-poppinsMedium mb-4">Metro Ticket</Text>

            <View className="w-full flex flex-col gap-4">
                <View className="flex-row justify-between border p-2 rounded-lg">
                    <View className="items-center">
                        <Text className="text-base">From</Text>
                        <Text className="text-xl font-poppinsMedium">{ticket.from}</Text>
                    </View>
                    <View className="self-center">
                        <ArrowLeftRight color={"black"}/>
                    </View>
                    <View className="items-center">
                        <Text className="text-base">To</Text>
                        <Text className="text-xl font-poppinsMedium">{ticket.to}</Text>
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

export default PopUpTicket;
