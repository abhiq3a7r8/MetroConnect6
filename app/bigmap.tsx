import { View  , Dimensions } from "react-native"
import { useEffect } from "react";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function bigmap() { 

  useEffect(() => {
    (async () => {
      
        const location = await Location.getCurrentPositionAsync({});
        const { latitude: lat, longitude: lng } = location.coords;

        // Send location to backend (non-blocking)
        fetch("http://192.168.179.100:4000/api/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ lat, lng }),
        }).catch(err => console.log("location post error: ", err)); //handle errors during post, but dont block.

        
    })();
  }, []);
    const { width } = Dimensions.get("window");
    const height = 200;

    return(
      <View style={{ width: width, flex: 1 }}>
        <WebView
          source={{ uri: "http://192.168.179.100:4000/map" }}
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
    )
}
