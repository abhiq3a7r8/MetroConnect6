import { useState } from "react";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import CustomText from "./CustomText";
import { MTextBox } from "./MTextBox";
import Mbutton from "./MButton";


export function LoginBox() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const name="abrat"

    const handleAuth = async () => {
        if (isSignUp) {
            if (password !== confirmPassword) {
                Alert.alert("Sign Up Failed", "Passwords do not match.");
                return;
            }
            try {
                const response = await fetch("https://3098fcax3k.execute-api.ap-south-1.amazonaws.com/default/Signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ phone, password, email , name }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 409) {
                        Alert.alert(
                            "User Already Exists",
                            "An account with this phone number already exists.",
                            [
                                {
                                    text: "Login Instead",
                                    onPress: () => setIsSignUp(false),
                                    style: "default",
                                },
                                {
                                    text: "Cancel",
                                    style: "cancel",
                                },
                            ]
                        );
                    } else {
                        Alert.alert("Sign Up Failed", errorData.message || `Sign up failed with status: ${response.status}`);
                    }
                    return;
                }
                

                const data = await response.json();
                console.log("Sign Up Successful:", data);

                router.push({
                    pathname: "/signupotp",
                    params: {
                      phone,
                    },
                  });
                

                
                setIsSignUp(false);
            } catch (error) {
                Alert.alert("Sign Up Error", `Something went wrong during sign up: ${error.message}`);
            }
        } else {
            try {
                const response = await fetch("https://7gxd5h135a.execute-api.ap-south-1.amazonaws.com/Developmemt/Login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ phone, password }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 401) {
                        Alert.alert(
                            "Login Failed",
                            "Invalid phone/password or the user does not exist.",
                            [
                                {
                                    text: "Go to Sign Up",
                                    onPress: () => setIsSignUp(true),
                                    style: "default",
                                },
                                {
                                    text: "Cancel",
                                    style: "cancel",
                                },
                            ]
                        );
                    } else {
                        Alert.alert("Login Failed", errorData.message || `Login failed with status: ${response.status}`);
                    }
                    return;
                }
                

                const data = await response.json();
                console.log("Login Successful:", data);
                const token = data.tokens.AccessToken
                console.log("ACESSMANNNN :       " + token )
                router.replace({ pathname: "/enterotp", params: { phone , token } });

                await fetch("https://r80w3crtk8.execute-api.ap-south-1.amazonaws.com/default/sendOtp", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "send",
                        phone
                        }),
                });
                
            } catch (error) {
                Alert.alert("Error", `Something went wrong during login: ${error.message}`);
            }
        }
    };

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
    };

    return (
        <View className="bg-white h-auto w-[90%] rounded-[10] justify-evenly items-center p-4 gap-4">
            <CustomText className="text-black text-4xl self-start ml-4 mt-2">{isSignUp ? "Sign Up" : "Login"}</CustomText>
            {isSignUp && (
                <MTextBox placeholder="Email" value={email} onChangeText={setEmail} />
            )}
            <MTextBox placeholder="Phone Number" value={phone} onChangeText={setPhone} />
            <MTextBox placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            {isSignUp && (
                <MTextBox placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            )}
            <Mbutton buttontext={isSignUp ? "Sign Up" : "Continue"} onPress={handleAuth} />

            <View className="flex-row mt-2">
                <Text className="font-poppins mr-1">{isSignUp ? "Already have an account?" : "New user?"}</Text>
                <TouchableOpacity onPress={toggleSignUp}>
                    <Text className="font-poppins color-blue-800">{isSignUp ? "Log in" : "Sign up"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default LoginBox;