import { TextInput, View } from "react-native";
import { useRef, useState } from "react";

export function Otpinput({ onChangeOtp }) {
    const inputRefs = Array(6).fill(null).map(() => useRef(null));
    const [otp, setOtp] = useState(Array(6).fill(""));

    const handleTextChange = (text, index) => {
        if (text.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            if (text && index < 5) {
                inputRefs[index + 1].current.focus();
            }

            if (newOtp.every((digit) => digit !== "")) {
                if (onChangeOtp) {
                    onChangeOtp(newOtp.join(""));
                }
            }
        }
    };

    return (
        <View className="flex flex-row ">
            {[...Array(6)].map((_, index) => (
                <TextInput
                    key={index}
                    ref={inputRefs[index]}
                    className="text-center m-1 font-poppins text-3xl bg-zinc-100 border-2 border-zinc-300 h-14 rounded-lg w-9"
                    maxLength={1}
                    keyboardType="numeric"
                    onChangeText={(text) => handleTextChange(text, index)}
                />
            ))}
        </View>
    );
}

export default Otpinput;