import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

type EventDetails = {
  [key: string]: {
    title: string;
    description: string;
  };
};

const eventDetails: EventDetails = {
  '1': {
    title: "Rudy's Poetry Contest",
    description: "Rudy's Attic proudly presents its first annual poetry reading contest. Come see readings from talented local poets or sign up to compete for a chance to win terrific prizes!",
  },
  '2': {
    title: "Shut Your Pie Hole (Eating Contest)",
    description: "Join us to see who can tackle the most slices of our delicious pizza pies. You never lose with great pizza, but the best eater gets free slices for a year!",
  },
  '3': {
    title: "Union Club Bar & Grill: Open Mic Nite",
    description: "Calling all local talent for a fun-filled evening at the Union Club's Open Mic Nite. All talents welcome, so let's sing and dance the night away!",
  },
};

const EventDescription = () => {
  const { eventId } = useLocalSearchParams();
  const event = eventDetails[eventId[0]] || { title: "Event Not Found", description: "No description available for this event." };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
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
