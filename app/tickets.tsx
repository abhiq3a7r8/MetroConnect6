import { View , Text } from "react-native"
import QRticket from "@/components/QRticket"
import { Navbar } from "@/components/Navbar"
import { useLocalSearchParams } from "expo-router"

export function tickets(){
    const params = useLocalSearchParams()
    return(
        <View className="flex-1 items-center">
            <Text className="font-poppinsMedium text-3xl items-center mt-4 ">Your Tickets</Text>
            <QRticket startStation={params.startStation} endStation={params.endStation} tripType={params.tripType} numTickets={params.numTickets}/>
            <Navbar />
        </View>
    )
}

export default tickets