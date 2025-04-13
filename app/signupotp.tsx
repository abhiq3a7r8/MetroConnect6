import { DefaultNavigator } from "expo-router/build/views/Navigator"
import { View } from "react-native"
import { useLocalSearchParams } from "expo-router"
import CheckMail from "@/components/CheckMail"

export function singupotp(){
    const params = useLocalSearchParams()
    return(
        <View className="flex-1 items-center justify-center" >
            <CheckMail phone={params.phone}/>
        </View>
    )
}

export default singupotp