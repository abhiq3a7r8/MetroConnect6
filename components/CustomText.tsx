import { Text, TextProps } from "react-native";
import { useCustomFonts } from "./utils/useCustomFonts";

export default function CustomText({ style, ...props }: TextProps) {
  const fontsLoaded = useCustomFonts();
  
  if (!fontsLoaded) return null; // Prevents flickering

  return <Text style={[{ fontFamily: "PoppinsRegular" }, style]} {...props} />;
}
