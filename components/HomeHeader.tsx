import { View, Text, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import { router } from "expo-router";

export function HomeHeader() {
  return (
    <View className="h-10 w-[90%] flex-row items-center mb-10 mt-10 justify-between">
      <Text className="ml-6 font-poppinsMedium text-2xl">Welcome!</Text>

      <TouchableOpacity
        className="flex-row items-center justify-evenly bg h-full w-28 rounded-3xl border-2"
        onPress={() => router.replace("/")}
      >
        <MapPin color={"black"}/>
        <Text className="font-poppins">Mumbai</Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeHeader;
