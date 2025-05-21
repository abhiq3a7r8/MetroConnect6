import { useState } from "react"
import { View , Text, TouchableOpacity , Alert} from "react-native"
import { Mail } from "lucide-react-native"
import Mbutton from "./MButton"
import Otpinput from "./Otpinput"
import { router } from "expo-router"


export function CheckMail({ phone }: any){
    const [otpValue, setOtpValue] = useState("")
    console.log("rich"+phone)
    const handleOtpChange = (otp: any) => {
        setOtpValue(otp);
    };
    console.log(otpValue)

    const verifyOtp = async () => {
        
        try {
          const response = await fetch('https://nni2pblzsi.execute-api.ap-south-1.amazonaws.com/default/ConfirmSignup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                phone: phone,
                code: otpValue, 
                 
            }),
          });
    
          const data = await response.json();
    
          if (response.ok) {
            Alert.alert('Success', data.message || 'OTP verified successfully!');
            router.replace("/dashboard")
            await fetch("https://xdrkbxo8pe.execute-api.ap-south-1.amazonaws.com/default/PushNotifications", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ title: "Registration Sucessful" , body: "Welcome to Metro Connect 6" }), 
          });
          } else {
            Alert.alert('Error', data.error || 'Invalid OTP. Please try again.');
          }
        } catch (error) {
          console.error('API call failed:', error);
          Alert.alert('Error', 'Failed to connect to the server.');
        } 
      };

    
    return(
        <View className="bg-white h-auto w-[90%] rounded-[10] justify-evenly items-center p-4 gap-4">
            <Text className="font-poppinsMedium text-2xl">Check your Mail</Text>
            <TouchableOpacity>
            <View className="bg-green-100 p-3 rounded-lg">
            <Mail color={"black"} size={"48"}/>
            </View>
            </TouchableOpacity>
            <Text className="font-poppins text-center">We have sent you verification code on your email </Text>
            
            <Otpinput onChangeOtp={handleOtpChange} />
            <Mbutton buttontext="Confirm" onPress={verifyOtp}/>
        </View>
    )
}

export default CheckMail