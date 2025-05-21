import { View } from "react-native";
import Mbutton from "@/components/MButton";
import Otpinput from "@/components/Otpinput";
import { useState } from "react";
import { router , useLocalSearchParams } from "expo-router";



export function Enterotp() {
    const [otpValue, setOtpValue] = useState("");
    const { phone , token } = useLocalSearchParams();
    const rawPhone = Array.isArray(phone) ? phone[0] : phone;    
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
                console.log(" did i stutter ? " + token )
                
                



                router.replace("/dashboard");
                await fetch("https://xdrkbxo8pe.execute-api.ap-south-1.amazonaws.com/default/PushNotifications", {
                    method: "POST",
                    headers: {
                        // "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ title: "Login Sucessful" , body: "Welcome back to Metro Connect" }), 
                });

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