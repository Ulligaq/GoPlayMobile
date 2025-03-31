import React from "react";
import { View, Text, ScrollView, Image, Button, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Event } from "../data/EventsRepository";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import eventStyles from "../styles/eventStyles"; // Assuming this has necessary styles

const EventDescription = () => {
  const searchParams = useLocalSearchParams();
  const event = searchParams.event ? JSON.parse(searchParams.event as string) as Event : null;

  if (!event) {
    return (
      <View style={eventStyles.container}>
        <Text style={eventStyles.title}>Event Not Found</Text>
        <Text style={eventStyles.description}>No details available for this event.</Text>
      </View>
    );
  }

  const {
    EventName,
    EventType,
    EventDescription: description,
    EventDateTime,
    Address,
    AgeRange,
    SoberFriendly,
    PrimaryImage,
    SecondaryImages = [],
  } = event;

  const openInMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(Address)}`;
    Linking.openURL(url);
  };

  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={eventStyles.container}>
      <TouchableOpacity onPress={() => router.back()} style={eventStyles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#333" />
      <Text style={eventStyles.backText}>Back</Text>
      </TouchableOpacity>
      <Text style={eventStyles.title}>{EventName}</Text>
      <Text style={eventStyles.subtitle}>{EventType}</Text>

      {PrimaryImage && (
        <Image source={{ uri: PrimaryImage }} style={eventStyles.primaryImage} />
      )}

      <Text style={eventStyles.sectionTitle}>Description</Text>
      <Text style={eventStyles.description}>{description}</Text>

      <Text style={eventStyles.sectionTitle}>Date & Time</Text>
      <Text style={eventStyles.info}>{EventDateTime}</Text>

      <Text style={eventStyles.sectionTitle}>Address</Text>
      <Text style={eventStyles.info}>{Address}</Text>
      <Button title="Open in Maps" onPress={openInMaps} />

      <Text style={eventStyles.sectionTitle}>Details</Text>
      <Text style={eventStyles.info}>Age Range: {AgeRange || "All ages"}</Text>
      <Text style={eventStyles.info}>Sober Friendly: {SoberFriendly ? "Yes" : "No"}</Text>

      {SecondaryImages.length > 0 && (
        <>
          <Text style={eventStyles.sectionTitle}>Gallery</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SecondaryImages.map((url: string, index: number) => (
              <Image key={index} source={{ uri: url }} style={eventStyles.secondaryImage} />
            ))}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};

export default EventDescription;