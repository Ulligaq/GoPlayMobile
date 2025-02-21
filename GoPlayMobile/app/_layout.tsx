import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import TopBottomBars from "./topbottombars";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import GestureHandlerWrapper from "./GestureHandlerWrapper";

export default function RootLayout() {
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
    return null; 
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
    flex: 1, 
  },
  topBarContainer: {
    height: 50, 
  },
  content: {
    flex: 1,
  },
  bottomBarContainer: {
    height: 50,
  },
});