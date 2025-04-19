import { View , Text, Touchable, TouchableOpacity , ScrollView } from "react-native"
import TicketSummary from "@/components/TicketSummary"
import { router, useLocalSearchParams } from "expo-router"
import { Navbar } from "@/components/Navbar"
import { ChevronLeft } from "lucide-react-native"
import ShakePopup from "@/components/ShakePopup"
export function bookingsummary(){
    const params = useLocalSearchParams()
    
    return(
        <View className="flex-1">
        <ScrollView>
        <View className="items-center flex-1">
            <View className="flex-row items-center mt-4 w-full justify-between px-8">
            <TouchableOpacity onPress={router.back}>
            <ChevronLeft />
            </TouchableOpacity>
            <Text className="font-poppins text-xl">Wed, 2 April</Text>
            </View>
            <TicketSummary startStation={params.startStation} endStation={params.endStation} tripType={params.tripType} numTickets={params.numTickets} startLine={params.startLine} endLine={params.endLine} />
            <View className="h-28"></View>
            <ShakePopup />
            
        </View>
        
        </ScrollView>
        <Navbar />
        </View>
    )
}

export default bookingsummary