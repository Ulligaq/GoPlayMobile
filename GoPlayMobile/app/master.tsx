import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

const INITIAL_REGION = {
  latitude: 46.8721,
  longitude: -113.9940,
  latitudeDelta: 4,
  longitudeDelta: 4,
};

const Master = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={INITIAL_REGION} />
        <Text style={styles.mainText}>Welcome to Missoula</Text>
      </View>
    </View>
  );
};

export default Master;

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
  mainText: {
    fontFamily: "Futura-Heavy",
    fontSize: 30,
    color: "#652e10",
    marginBottom: 10,
  },
  map: {
    width: "100%",
    height: "50%",
  },
});