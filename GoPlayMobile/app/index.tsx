import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";
import { useRouter } from "expo-router"; 

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const router = useRouter(); 

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.replace("/master"); 
      });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      fadeAnim.setValue(1);
    };
  }, [fadeAnim, router]);

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <View style={styles.container}>
        <Text style={styles.futuraBoldsmall}>Welcome to</Text>
        <Image source={require("../assets/images/goplaylogo.png")} style={styles.logo} />
        <Text style={styles.futuraBoldmedium}>Events Happening</Text>
        <Text style={styles.futuraBoldlarge}>NOW</Text>
      </View>
    </Animated.View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  futuraBoldsmall: {
    fontFamily: "Futura-Heavy", 
    fontSize: 20,
    color: "#652e10",
  },
  futuraBoldmedium: {
    fontFamily: "Futura-Medium",
    fontSize: 30,
    color: "#652e10",
  },
  futuraBoldlarge: {
    fontFamily: "Futura-Bold",
    fontSize: 60,
    color: "#652e10",
  },
  logo: {
    width: 350,
    height: 350,
    resizeMode: "contain",
  },
});