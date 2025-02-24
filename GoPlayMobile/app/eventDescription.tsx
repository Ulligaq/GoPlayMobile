import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

const EventDescription = () => {
  const { eventId } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Description</Text>
      <Text style={styles.description}>Event Description Missing</Text>
    </View>
  );
};

export default EventDescription;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
