import { View } from "react-native";
import Mbutton from "@/components/MButton";
import Otpinput from "@/components/Otpinput";
import { useState } from "react";
import { router , useLocalSearchParams } from "expo-router";

export function Enterotp() {
    const [otpValue, setOtpValue] = useState("");
    const { phone: rawPhone } = useLocalSearchParams();
    console.log(rawPhone)
    const handleVerify = async (otp) => {
        
    
        try {
            const response = await fetch("https://r80w3crtk8.execute-api.ap-south-1.amazonaws.com/default/sendOtp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ action: "verify", phone: rawPhone, code: otp }), 
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("OTP Verified Successfully:", data.message);
                router.replace("/dashboard");
            } else {
                console.log("OTP Verification Failed:", data.error);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };
    

    const handleOtpChange = (otp) => {
        setOtpValue(otp);
    };

    return (
        <View className="flex-1 items-center justify-center">
            <View className="bg-white h-64 w-[90%] rounded-[10] justify-evenly items-center p-4">
                <Otpinput onChangeOtp={handleOtpChange} />
                <Mbutton buttontext="Verify" onPress={() => handleVerify(otpValue)} />
            </View>
        </View>
    );
}

export default Enterotp;