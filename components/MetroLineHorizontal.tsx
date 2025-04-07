import React from "react";
import { ScrollView, View, Text } from "react-native";

const metroStations = [
  "Ghatkopar",
  "Jagruti Nagar",
  "Asalpha",
  "Saki Naka",
  "Marol Naka",
  "Airport Road",
  "Chakala",
  "WEH",
  "Andheri",
  "Azad Nagar",
  "DN Nagar",
  "Versova",
];

export default function MetroLineVertical() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="border border-zinc-400 rounded-lg mb-4 self-start h-72">
      <View className="p-4"> 
        {metroStations.map((station, index) => (
          <View key={index} className="items-center mb-8 flex-row gap-2"> 
            
            <View className="w-2 h-2 rounded-sm bg-zinc-600" />

            <Text className="text-black text-xs font-poppinsMedium">
              {station}
            </Text>
          </View>
        ))}
        
        <View className="w-0.5 h-full bg-blue-600 absolute left-[17] top-5"/>
      </View>
    </ScrollView>
  );
}