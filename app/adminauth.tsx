import { View, Text, Alert } from "react-native";
import { MTextBox } from "@/components/MTextBox";
import Passinput from "@/components/Passinput";
import Mbutton from "@/components/MButton";
import { router } from "expo-router";

export function AdminAuth() {
    const handleProceed = () => {
        router.push("/admin")
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="bg-white h-[500] w-[90%] rounded-[10] justify-evenly items-center p-4">
                <Text className="font-poppinsMedium text-3xl">Admin Login</Text>
                <MTextBox placeholder="Enter Admin number" />
                <MTextBox placeholder="Password"  secureTextEntry/>
                <Text className="font-poppins text-lg">Enter 12-digit passkey</Text>
                <Passinput />
                <Mbutton buttontext="Proceed" onPress={handleProceed} />
            </View>
        </View>
    );
}

export default AdminAuth;
