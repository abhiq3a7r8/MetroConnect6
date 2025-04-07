import { View, Text } from "react-native";

export function Metrostatus({ lineNumber, bgColor, nextTrainTime }) {
  return (
    <View className={`h-20 w-full ${bgColor} flex-row items-center px-4 mb-2 rounded-md`}>
      <View className="w-12 bg-white rounded-lg">
        <Text className="font-bold font-poppinsMedium text-xl text-center">
          Line 
        </Text>
        <Text className="font-poppins text-3xl text-center">
        {lineNumber}
        </Text>
      </View>
      <View className="flex-1 ml-20">
        <Text className="text-base font-poppins">
          Status: On Time
        </Text>
        <Text className="font-poppinsBold text-base">
          Next train: {nextTrainTime} min
        </Text>
      </View>
    </View>
  );
}

export default Metrostatus;