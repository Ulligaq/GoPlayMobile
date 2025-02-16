import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import TopBottomBars from "./topbottombars";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import GestureHandlerWrapper from "./GestureHandlerWrapper";

export default function RootLayout() {
  // ✅ Load custom fonts
  const [fontsLoaded] = useFonts({
    "Futura-Heavy": require("../assets/fonts/Futura Heavy font.ttf"),
    "Futura-Medium": require("../assets/fonts/futura medium bt.ttf"),
    "Futura-Bold": require("../assets/fonts/Futura Bold font.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // ✅ Prevent rendering before fonts load
  }

  return (
    <GestureHandlerWrapper>
      <View style={styles.container}>
        <View style={styles.topBarContainer}>
          <TopBottomBars position="top" />
        </View>
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
        <View style={styles.bottomBarContainer}>
          <TopBottomBars position="bottom" />
        </View>
      </View>
    </GestureHandlerWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // ✅ Ensures the whole screen is used
  },
  topBarContainer: {
    height: 50, // ✅ Exact height of the top bar
  },
  content: {
    flex: 1, // ✅ Ensures this fills all remaining space (NO BLACK BARS)
  },
  bottomBarContainer: {
    height: 50, // ✅ Exact height of the bottom bar
  },
});