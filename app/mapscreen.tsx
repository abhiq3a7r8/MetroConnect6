import { View  , Dimensions } from "react-native"
import { WebView } from "react-native-webview";

export default function mapscreen() { 

    const { width } = Dimensions.get("window");
    const height = 200;

    return(
      <View style={{ width: width, flex: 1 }}>
        <WebView
          source={{ uri: "http://192.168.179.100:4000" }}
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
