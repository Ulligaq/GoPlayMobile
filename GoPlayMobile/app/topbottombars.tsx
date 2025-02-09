import React from "react";
import { StyleSheet, View, Image } from "react-native";

const TopBottomBars = ({ position }: { position: "top" | "bottom" }) => {
  return (
    <View style={[styles.bar, position === "top" ? styles.topBar : styles.bottomBar]}>
      {position === "top" && (
        <Image source={require("../assets/images/goplaylogo.png")} style={styles.logo} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    height: 50,
    backgroundColor: "#4c9a89",
  },
  bottomBar: {
    height: 50,
    backgroundColor: "#4c9a89",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});

export default TopBottomBars;