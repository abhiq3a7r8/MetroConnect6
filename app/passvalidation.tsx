import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";
import MetroPass from "@/components/PassComponent";
import ApplyPass from "@/components/ApplyForPass";
import { Navbar } from "@/components/Navbar";
import ShakePopup from "@/components/ShakePopup";

export function passvalidation() {
  const [showApplyPass, setShowApplyPass] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="p-4">
        <Text className="font-poppinsMedium self-center text-3xl mt-4">Metro Pass</Text>
        
        <MetroPass />

        {!showApplyPass && (
          <TouchableOpacity
            className="py-3 px-5 rounded-lg mt-6 self-center border border-zinc-400"
            onPress={() => setShowApplyPass(true)}
          >
            <Text className="font-poppinsMedium text-base">+ Apply for new Pass</Text>
          </TouchableOpacity>
        )}

        {showApplyPass && <ApplyPass />}
      </ScrollView>

      <ShakePopup />
      <Navbar />
    </View>
  );
}

export default passvalidation;
