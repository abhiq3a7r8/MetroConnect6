import { Pressable, View, Text } from "react-native";
import { useState } from "react";
import { CreditCard, Banknote, QrCode } from "lucide-react-native";

export function PaymentMode() {
    const [selectedMode, setSelectedMode] = useState(0);

    return (
        <View className="self-center h-16 w-[90%] bg-gray-200 mb-6 flex-row rounded-lg border border-zinc-300 shadow-md ">
            <Pressable 
                className={`flex-1 h-full items-center justify-center rounded-l-lg ${
                    selectedMode === 1 ? 'bg-blue-500' : 'bg-white'
                }`}
                onPress={() => setSelectedMode(1)}
            >
                <QrCode size={28} color={selectedMode === 1 ? "white" : "black"} />
                <Text className={`font-poppinsMediums text-xs mt-1 ${selectedMode === 1 ? 'text-white' : 'text-black'}`}>
                    UPI
                </Text>
            </Pressable>

            <Pressable 
                className={`flex-1 h-full items-center justify-center ${
                    selectedMode === 2 ? 'bg-blue-500' : 'bg-white'
                }`}
                onPress={() => setSelectedMode(2)}
            >
                <CreditCard size={28} color={selectedMode === 2 ? "white" : "black"} />
                <Text className={`text-xs mt-1 ${selectedMode === 2 ? 'text-white' : 'text-black'}`}>
                    Card
                </Text>
            </Pressable>

            <Pressable 
                className={`flex-1 h-full items-center justify-center rounded-r-lg ${
                    selectedMode === 3 ? 'bg-blue-500' : 'bg-white'}
                `}
                onPress={() => setSelectedMode(3)}
            >
                <Banknote size={28} color={selectedMode === 3 ? "white" : "black"} />
                <Text className={`text-xs mt-1 ${selectedMode === 3 ? 'text-white' : 'text-black'}`}>
                    Net Banking
                </Text>
            </Pressable>
        </View>
    );
}

export default PaymentMode;
