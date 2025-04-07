import { Navbar } from "@/components/Navbar";
import PlanJourney from "@/components/PlanJourney";
import React , { useState }from "react";
import { Dimensions, View , Text, Pressable } from "react-native";
import { WebView } from "react-native-webview";
import { ArrowRight } from "lucide-react-native";
import InMetro from "@/components/InMetro";
import ShakePopup from "@/components/ShakePopup";

const { width } = Dimensions.get("window");
const height = 200;

export default function MapWebView() {
  return (
    <View className="flex-1 items-center bg-zinc-200">
    <PlanJourney />
    <View className="self-center w-[90%] justify-center bg-white p-4 rounded-xl">
      <View className="flex-row gap-6">
      <Text className="font-poppinsMedium text-2xl mb-2">Nearby Stations</Text>
      <ArrowRight color={"black"}/>
      </View>
      <View style={{ width: width * 0.8, height }}>
        <WebView
          source={{ uri: "http://192.168.133.42:4000" }}
          style={{ width: "100%", height: "100%", borderRadius: 40 }}
          injectedJavaScript={`
            const meta = document.createElement('meta');
            meta.setAttribute('name', 'viewport');
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            document.getElementsByTagName('head')[0].appendChild(meta);
          `}
          scalesPageToFit={false}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    </View>
    <InMetro />
    <ShakePopup />
    <Navbar />
    </View>
  );
}
