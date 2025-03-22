import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Event } from "../data/EventsRepository"; // Import Event type
import eventStyles from "../styles/eventStyles"; // Correct import path

const EventDescription = () => {
  const searchParams = useLocalSearchParams();
  const event = searchParams.event ? JSON.parse(searchParams.event as string) as Event : null; // Parse event manually

  if (!event) {
    return (
      <View style={eventStyles.container}>
        <Text style={eventStyles.title}>Event Not Found</Text>
        <Text style={eventStyles.description}>No details available for this event.</Text>
      </View>
    );
  }

  return (
    <View style={eventStyles.container}>
      <Text style={eventStyles.title}>{event.EventName}</Text>
      <Text style={eventStyles.description}>
        Decscription coming soon... along with images... and other stuffs...
      </Text>
    </View>
  );
};

export default EventDescription;