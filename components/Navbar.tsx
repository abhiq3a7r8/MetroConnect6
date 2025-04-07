import { View, TouchableOpacity, Text } from "react-native";
import { Home, MapPin, QrCode, CreditCard } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";

const navItems = [
  { icon: Home, label: "Home", route: "/dashboard" },
  { icon: MapPin, label: "Navigate", route: "/navigate" },
  { icon: QrCode, label: "Tickets", route: "/tickets" },
  { icon: CreditCard, label: "Pass", route: "/passvalidation" },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // get the current route

  return (
    <View className="flex-row items-center justify-evenly absolute bottom-0 h-20 rounded-t-3xl w-full bg-zinc-800 z-10">
      {navItems.map(({ icon: Icon, label, route }) => {
        const isActive = pathname === route;

        return (
          <TouchableOpacity key={label} onPress={() => router.replace(route)}>
            <View className="flex items-center">
              <Icon size={28} color={isActive ? "#86efac" : "white"} />
              <Text className={`font-poppinsMedium text-xs mt-1 ${isActive ? "text-green-300" : "text-zinc-300"}`}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
