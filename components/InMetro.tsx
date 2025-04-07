import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";

export function InMetro() {
  const [isInMetro, setIsInMetro] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Set default selection based on current route
  useEffect(() => {
    if (pathname === "/insidemetro") {
      setIsInMetro(true);
    } else if (pathname === "/navigate") {
      setIsInMetro(false);
    }
  }, [pathname]);

  const handlePress = (value: boolean) => {
    setIsInMetro(value);

    setTimeout(() => {
      if (value && pathname !== "/insidemetro") {
        router.replace({
          pathname: "/insidemetro",
          params: { isInMetro: "true" },
        });
      } else if (!value && pathname !== "/navigate") {
        router.replace({
          pathname: "/navigate",
          params: { isInMetro: "false" },
        });
      }
    }, 100);
  };

  return (
    <View className="self-center w-[90%] h-24 mt-6 items-center bg-white p-4 rounded-xl flex-row justify-between">
      <Text className="font-poppinsMedium text-xl">Are you in a Metro?</Text>

      <View className="h-10 w-24 flex-row">
        <Pressable
          className={`h-full w-12 rounded-l-md items-center justify-center ${
            isInMetro === true ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={() => handlePress(true)}
        >
          <Text className="text-white font-bold">Yes</Text>
        </Pressable>

        <Pressable
          className={`h-full w-12 rounded-r-md items-center justify-center ${
            isInMetro === false ? "bg-yellow-500" : "bg-gray-300"
          }`}
          onPress={() => handlePress(false)}
        >
          <Text className="text-white font-bold">No</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default InMetro;
