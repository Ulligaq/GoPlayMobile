import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const TopBottomBars = ({ position }: { position: "top" | "bottom" }) => {
  const router = useRouter();

  return (
    <View style={[styles.bar, position === "top" ? styles.topBar : styles.bottomBar]}>
      {position === "top" && (
        <Image source={require("../assets/images/goplaylogo.png")} style={styles.logo} />
      )}
      {position === "bottom" && (
        <TouchableOpacity style={styles.gearIcon} onPress={() => router.push("/preferenceScreen")}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    justifyContent: "center",
    position: "relative",
  },
  topBar: {
    height: 50,
    backgroundColor: "#4c9a89",
    alignItems: "center",
  },
  bottomBar: {
    height: 50,
    backgroundColor: "#4c9a89",
    justifyContent: "center",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  gearIcon: {
    position: "absolute",
    right: 10,
    top: 13,
  },
});

export default TopBottomBars;