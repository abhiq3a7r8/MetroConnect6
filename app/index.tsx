import { router , useRouter } from "expo-router";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useRef } from "react";
import { LoginBox } from "@/components/LoginBox";

export default function Index() {
  const tapCount = useRef(0);

  const handleTap = () => {
    tapCount.current += 1;
    console.log(tapCount)
    if (tapCount.current === 4) {
      router.push("/adminauth")
    }
  };

  const bybassLogin = () => {
    router.replace("/dashboard")
  }

  return (
    <View className="flex-1 items-center justify-evenly bg-gray-100">
      <View className="items-center">
      <TouchableOpacity onPress={handleTap}>
        <Image source={require("@/assets/login.png")} className="mb-4" />
      </TouchableOpacity>
      <TouchableOpacity onPress={bybassLogin}>
      <Text className="color-black text-4xl font-poppinsMedium">
        Metro Connect 5
      </Text>
      </TouchableOpacity>
      </View>
      <LoginBox />
    </View>
  );
}
